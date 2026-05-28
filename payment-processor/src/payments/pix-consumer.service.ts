import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { SqsService } from '../sqs/sqs.service';

type PixPendenteMessage = { id_ordem: string };
type PixStatusMessage = { id_ordem: string; status: 'PAGO' | 'CANCELADO' | 'REPROVADO' };

const STATUSES: PixStatusMessage['status'][] = ['PAGO', 'CANCELADO', 'REPROVADO'];

@Injectable()
export class PixConsumerService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(PixConsumerService.name);
  private readonly pendentesQueue =
    process.env.SQS_PIX_PENDENTE_QUEUE ?? 'pagamento-pix-pendente.fifo';
  private readonly statusQueue =
    process.env.SQS_PIX_STATUS_QUEUE ?? 'pagamento-pix-status';
  private running = false;
  private loopPromise: Promise<void> | null = null;

  constructor(private readonly sqs: SqsService) {}

  onApplicationBootstrap(): void {
    this.running = true;
    this.loopPromise = this.loop();
    this.logger.log(`Consumer iniciado na fila ${this.pendentesQueue}`);
  }

  async onApplicationShutdown(): Promise<void> {
    this.running = false;
    if (this.loopPromise) {
      await this.loopPromise;
    }
  }

  private async loop(): Promise<void> {
    while (this.running) {
      try {
        const messages = await this.sqs.receiveMessages(this.pendentesQueue, 5);
        for (const msg of messages) {
          if (!msg.Body || !msg.ReceiptHandle) continue;
          await this.processarMensagem(msg.Body, msg.ReceiptHandle);
        }
      } catch (err) {
        this.logger.error('Erro no loop do consumer PIX', err as Error);
        await this.sleep(2000);
      }
    }
  }

  private async processarMensagem(body: string, receiptHandle: string): Promise<void> {
    try {
      const payload = JSON.parse(body) as PixPendenteMessage;
      const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];

      await this.sqs.sendMessage<PixStatusMessage>(this.statusQueue, {
        id_ordem: payload.id_ordem,
        status,
      });

      await this.sqs.deleteMessage(this.pendentesQueue, receiptHandle);
      this.logger.log(
        `PIX processado idOrdem=${payload.id_ordem} status=${status} publicado em ${this.statusQueue}`,
      );
    } catch (err) {
      this.logger.error(`Falha ao processar mensagem: ${body}`, err as Error);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
