exports.triggerError = (req, res, next) => {
    try {
      throw new Error('Intentional error typ3 500!!');
    } catch (err) {
      next(err); 
    }
  };