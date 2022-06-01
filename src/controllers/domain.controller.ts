import { RequestHandler } from "express";
import Domain from "../models/Domain";
import { constructLinkAndGetVitalsAsync } from "../services/domain/domain.service";
import crawl from "../services/crawl";

export const createDomain: RequestHandler = async (req, res, next) => {
  try {
    const { domainName, email } = req.body;

    const domain = await Domain.create({ domainName });

    constructLinkAndGetVitalsAsync(domainName, domain._id, email);

    res.status(201).json({
      message: "success",
      payload: domain,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAllDomains: RequestHandler = async (req, res, next) => {
  try {
    const domain = await Domain.find();
    res.status(200).json({
      domain,
    });
  } catch (err) {
    next(err);
  }
};

export const getDomainById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const domain = await Domain.findOne({ _id: id });
    if (!domain) {
      console.log("Nothing found.");
    }
    res.status(200).json({ domain });
  } catch (err) {
    next(err);
  }
};

export const getUrlsViaSitemap: RequestHandler = async (req, res, next) => {
  try {
    let url = req.params[0];
    let links = await crawl(url);
    res.send({ message: links });
  } catch (error) {
    next(error);
  }
};

export const updateDomain: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const domain = await Domain.findOne({ _id: id });
    if (!domain) {
      console.log("Domain not found");
      // throw creatError.NotFound();
    }

    await Domain.updateOne({ _id: id }, { $set: req.body });
    res.status(201).json({
      message: "Successfully updated",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteDomain: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const domain = await Domain.findOne({ _id: id });
    if (!domain) {
      // throw creatError.NotFound();
      console.log("Domain not found");
    }
    await Domain.deleteOne({ _id: id });
    res.status(201).json({
      message: "Successfully deleted",
    });
  } catch (err) {
    next(err);
  }
};
