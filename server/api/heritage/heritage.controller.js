/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/heritages              ->  index
 * POST    /api/heritages              ->  create
 * GET     /api/heritages/:id          ->  show
 * GET     /api/heritages/intersects/:lat/:lng          ->  show
 * PUT     /api/heritages/:id          ->  update
 * DELETE  /api/heritages/:id          ->  destroy
 */

'use strict';

const sqldb = require('../../sqldb');
const Heritage = sqldb.Heritage;

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Heritages
exports.index = function(req, res) {
  var limit = req.query.limit || 10;
  Heritage.findAll({ attributes: { exclude: ['geom'] }, limit: limit })
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a list of Heritages
exports.intersect = function(req, res) {

  const limit = req.query.limit || 10;
  const lat = parseFloat(req.params.lat) || 0;
  const lng = parseFloat(req.params.lng) || 0;
  const tableName = Heritage.getTableName();

  const query = `SELECT * FROM ${tableName} WHERE ST_Intersects(ST_SetSRID(ST_Point(${lng}, ${lat}),4326), geom) LIMIT ${limit};`;

  Heritage.sequelize.query(query, { type: Heritage.sequelize.QueryTypes.SELECT, attributes: { exclude: ['geom'] } })
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Heritage from the DB
exports.show = function(req, res) {
  Heritage.find({
      where: {
        id: req.params.id
      },
      attributes: { exclude: ['geom'] }
    })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Heritage in the DB
exports.create = function(req, res) {
  Heritage.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Heritage in the DB
exports.update = function(req, res) {

  if (req.body.id) {
    delete req.body.id;
  }
  Heritage.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Heritage from the DB
exports.destroy = function(req, res) {
  Heritage.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
