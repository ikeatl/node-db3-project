const db = require("../../data/db-config");

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  try {
    const scheme = await db("schemes").where("scheme_id", req.params.scheme_id).first();

    if (scheme) {
      next();
    } else {
      next({ message: `scheme with scheme_id ${req.params.scheme_id} not found`, status: 404 });
    }
  } catch (error) {
    next({ message: "An error occured while checking scheme_id", status: 500 });
  }
};

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = async (req, res, next) => {
  try {
    const { scheme_name } = req.body;

    if (!scheme_name || typeof scheme_name !== "string" || !scheme_name.trim()) {
      return next({ message: "invalid scheme_name", status: 400 });
    }

    const exsistingScheme = await db("schemes").where("scheme_name", scheme_name.trim());
    if (exsistingScheme.length) {
      return next({ message: `Duplicate scheme_name: "${scheme_name}" found in database`, status: 422 });
    }
    next();
  } catch (error) {
    next({ message: "Server error while validating scheme_name", status: 500 });
  }
};

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = async (req, res, next) => {
  try {
    const { instructions, step_number } = req.body;
    if (!instructions || typeof instructions !== "string" || !instructions.trim() || typeof step_number !== "number" || step_number < 1) {
      return next({ message: "invalid step", status: 400 });
    }
    const exsistingStep = await db("steps").where("step_number", step_number);
    if (exsistingStep.length > 0) {
      return next({ message: `Duplicate step_number "${step_number}" found in database`, status: 422 });
    }
    next();
  } catch (error) {
    next({ message: "Server error while validating step_number", status: 500 });
  }
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
