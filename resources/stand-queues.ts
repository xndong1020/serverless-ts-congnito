export default {
  InvitationEmailQueue: {
    Type: "AWS::SQS::Queue",
    Properties: {
      QueueName: "invitation-email-queue-${self:custom.stage}",
    },
  },
};
