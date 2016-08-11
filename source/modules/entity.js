/**
 * =============================================================================
 * Galaxy Hunters v1 - Modules: Entity
 * =============================================================================
 * @date 2016-08-11
 * @author Kobus Pretorius
 * =============================================================================
 */


var Entity = function (_x, _y, _mass, _velocity, _angle) {
  var x, y, mass, radius, velocity, angle;

  x = _x;
  y = _y;
  mass = _mass;
  velocity = _velocity;
  angle = _angle;

  function answer() {
    return 42;
  }

  function distance(entity) {
    return Math.sqrt(Math.pow(x - entity.getX(), 2) +
            Math.pow(y - entity.getY(), 2));
  }

  function getX() {
    return x;
  }
  
  function setX(_x) {
    x = _x;
  }
  
  function getY() {
    return y;
  }
  
  function setY(_y) {
    y = _y;
  }
  
  function setXY(_x, _y) {
    x = _x;
    y = _y;
  }

  return {
    x: x,
    y: y,
    mass: mass,
    radius: radius,
    velocity: velocity,
    angle: angle,
    answer: answer,
    distance: distance,
    getX: getX,
    getY: getY,
    setX: setX,
    setY: setY,
    setXY: setXY
  };
};

module.exports = Entity;