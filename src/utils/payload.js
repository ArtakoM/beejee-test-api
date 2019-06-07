class Payload {
  static withItem(res, item) {
    return res.json({
      error: false,
      payload: {
        item,
      },
    });
  }

  static withItems(res, items) {
    return res.json({
      error: false,
      payload: {
        items,
      },
    });
  }

  static withMessage(res, message) {
    return res.json({
      error: false,
      payload: {
        message,
      },
    });
  }

  static withError(res, errorMessage = 'somethingWentWrong', code = 400) {
    let error = errorMessage;
    if (code === 401) {
      error = 'unauthorized';
    }

    return res.status(code).json({
      error: true,
      payload: {
        error,
      },
    });
  }
}

module.exports = Payload;
