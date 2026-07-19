const crypto = require("crypto");

exports.handler = async (event) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = JSON.parse(event.body);

    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

    if (sign === razorpay_signature) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Payment Verified"
        })
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: "Invalid Signature"
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message
      })
    };
  }
};