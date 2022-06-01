import { RequestHandler } from "express";
import Url from "../models/Url";
import Domain from "../models/Domain";

export const createUrl: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { url } = req.body;
    const domain = await Domain.findOne({ _id: id });

    if (!domain) {
      console.log("No domain found");
    }

    const newUrl = await Url.create({ url, domain: id });

    res.status(201).json({
      message: "Successfully created",
    });
  } catch (err) {
    next(err);
  }
};

// get all urls by domain id
export const getAllUrls: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const domain = await Domain.findOne({ _id: id });
    if (!domain) {
      console.log("no domain found");
    }
    const response = Url.find({ domain: id }).populate("domain");
    next(response);
  } catch (err) {
    next(err);
  }
};

//get all urls
export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const { url } = req.body;
    const { id } = req.params;
    const domain = await Domain.findOne({ _id: id });
    if (!domain) {
      console.log("no domain found");
    }
    const result = await Url.find({ url: url }).populate("domain");
    res.status(200).json({
      result,
    });
  } catch (err) {
    next(err);
  }
};

// get domain url by id
export const getDomainUrlById: RequestHandler = async (req, res, next) => {
  try {
    const { id, urlId } = req.params;
    const domain = await Domain.findOne({ _id: id });
    if (!domain) {
      console.log("domain not found");
    }
    const urls = await Url.findOne({ _id: urlId, domain: id }).populate(
      "domain"
    );
    res.status(200).json({
      urls,
    });
  } catch (err) {
    next(err);
  }
};

// update domain url by id
export const updateDomainUrlById: RequestHandler = async (req, res, next) => {
  try {
    const { id, urlId } = req.params;
    const domain = await Domain.findOne({ _id: id }).lean();
    if (!domain) {
      console.log("domain not found");
    }
    await Url.updateOne({ _id: urlId, domain: id }, { $set: req.body });
    res.status(201).json({
      message: "Successfully updated",
    });
  } catch (err) {
    next(err);
  }
};

// delete domain urls by id
export const deleteDomainUrlById: RequestHandler = async (req, res, next) => {
  try {
    const { id, urlId } = req.params;
    const domain = await Domain.findOne({ _id: id }).lean();
    const url = await Url.findOne({ _id: urlId }).lean();
    if (!domain || !url) {
      console.log("not found");
    }
    await Url.deleteOne({ _id: urlId, domain: id });
    res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (err) {
    next(err);
  }
};





