#!/bin/bash
set -e
echo "[localstack-init] criando filas SQS..."
awslocal sqs create-queue --queue-name pagamento-pix-pendente.fifo \
  --attributes FifoQueue=true,ContentBasedDeduplication=true
awslocal sqs create-queue --queue-name pagamento-pix-status
echo "[localstack-init] filas criadas."
