import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
  },
  bookNo: {
    type: String,
    default: '',
  },
  customerId: {
    type: String,
    required: true,
    unique: true,
  },
  selectedImages: {
    type: [{ imgSrc: String, buttonName: String }],
    default: [],
  },
});

const karigarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  karigarType: {
    type: [String],
    required: true,
  },
  karigarId: { type: String, required: true, unique: true },
  assignedOrders: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User.orders',
    default: [],
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const settingsSchema = new mongoose.Schema({
  pantPrice: { type: Number, default: 0 },
  pantCoatPrice: { type: Number, default: 0 },
  waistCoatPrice: { type: Number, default: 0 },
  coatPrice: { type: Number, default: 0 },
  shalwarKameezPrice: { type: Number, default: 0 },
  shirtPrice: { type: Number, default: 0 },
  shopAddress: { type: String, default: '' },
  shopPhoneNumber: { type: String, default: '' },
  shopName: { type: String, default: '' },
  termsAndCondition: { type: String, default: '' },
  shopImage: { type: String, default: '' },
});

const subOrderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User.customers',
    required: true,
  },
  karigarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User.karigars',
    default: null,
  },
  bookingNo: {
    type: String,
    required: true,
  },
  subId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  measurements: {
    type: Object,
    default: {},
  },
  selectedImages: {
    type: [{ imgSrc: String, buttonName: String }],
    default: [],
  },
  details: {
    type: Object,
    default: {},
  },
  collar: {
    type: Object,
    default: {},
  },
  patti: {
    type: Object,
    default: {},
  },
  cuff: {
    type: Object,
    default: {},
  },
  pocket: {
    type: Object,
    default: {},
  },
  shalwar: {
    type: Object,
    default: {},
  },
  silai: {
    type: Object,
    default: {},
  },
  button: {
    type: Object,
    default: {},
  },
  cutter: {
    type: Object,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isSubOrder: {
    type: Boolean,
    default: true,
  },
  parentOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User.orders',
    required: true,
  },
  pdfData: { type: String, default: "" }, // Added pdfData field
});

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User.customers',
    required: true,
  },
  karigarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User.karigars',
    default: null,
  },
  bookingNo: {
    type: String,
    required: true,
  },
  subId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  measurements: {
    type: Object,
    default: {},
  },
  selectedImages: {
    type: [{ imgSrc: String, buttonName: String }],
    default: [],
  },
  details: {
    type: Object,
    default: {},
  },
  collar: {
    type: Object,
    default: {},
  },
  patti: {
    type: Object,
    default: {},
  },
  cuff: {
    type: Object,
    default: {},
  },
  pocket: {
    type: Object,
    default: {},
  },
  shalwar: {
    type: Object,
    default: {},
  },
  silai: {
    type: Object,
    default: {},
  },
  button: {
    type: Object,
    default: {},
  },
  cutter: {
    type: Object,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isSubOrder: {
    type: Boolean,
    default: false,
  },
  parentOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User.orders',
    default: null,
  },
  subOrders: {
    type: [subOrderSchema],
    default: [],
  },
  pdfData: { type: String, default: "" }, // Added pdfData field
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  saveCredentials: {
    type: Boolean,
    default: false,
  },
  savedUsername: {
    type: String,
    default: null,
  },
  savedPlainPassword: {
    type: String,
    default: null,
  },
  settings: {
    type: settingsSchema,
    default: () => ({}),
  },
  customers: {
    type: [customerSchema],
    default: [],
  },
  karigars: {
    type: [karigarSchema],
    default: [],
  },
  orders: {
    type: [orderSchema],
    default: [],
  },
});

export default mongoose.model("User", userSchema);