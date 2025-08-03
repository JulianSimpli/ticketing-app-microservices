import mongoose from 'mongoose';

interface PaymentAttrs {
  orderId: string;
  stripeChargeId: string;
}

interface PaymentDoc extends mongoose.Document, PaymentAttrs {
  orderId: string;
  stripeChargeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  stripeChargeId: { type: String, required: true },
}, {
  toJSON: {
    transform(doc, ret: any) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
})

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };