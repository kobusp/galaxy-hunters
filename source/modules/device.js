/**
 * =============================================================================
 * Galaxy Hunters v1 - Modules: Device
 * =============================================================================
 * Parent class for all devices.
 * =============================================================================
 * @date 2016-08-16
 * @author Kobus Pretorius
 * =============================================================================
 */

/**
 * Negative values mean consumption.
 * @param {double} _powerRate     Rate of power production per timestep. Affected by heat.
 * @param {double} _powerFlow     Strength of power supply.
 * @param {double} _powerCapacity Amount of power that can be stored.
 * @param {double} _heatRate      Amount of heat produced per timestep.
 * @type type
 */
var Device = function (_powerRate, _powerFlow, _powerCapacity, _heatRate) {
  var powerRate, powerFlow, powerCapacity, heatRate,
          effectivePowerRate, powerVolume, heat, timestep, initialTimestep,
          linkedDevices, started, on;

  powerRate = _powerRate;
  powerFlow = _powerFlow;
  powerCapacity = _powerCapacity;
  heatRate = _heatRate;
  linkedDevices = [];
  started = false;
  on = false;

  /**
   * Start the simulation.
   * Start effective rate with power rate.
   * Start power volume with maximum power capacity.
   * Start heat with 0.
   * @param {int} _timestep   Simulation timestep
   */
  function start(_timestep) {
    effectivePowerRate = powerRate;
    powerVolume = powerCapacity;
    heat = 0;
    timestep = _timestep;
    initialTimestep = _timestep;
    started = true;

    startLinkedDevices(linkedDevices);
  }

  /**
   * Calculate current values for given timestep. Step any linked devices by the
   * same amount to synchronize the simulation. If any linked devices haven't
   * started, start them.
   * @param {int} _timestep   Simulation current time.
   */
  function step(_timestep) {
    var timeElapsed = _timestep - initialTimestep;

    if (on) {
      heat = limitHeat(heatRate, linkedDevices, timeElapsed);
      effectivePowerRate = calculateEffectivePowerRate(powerRate, heat);
      powerVolume = calculatePowerVolume(powerVolume, effectivePowerRate, powerCapacity, timeElapsed);
    } else {
      heat = limitHeat(0, linkedDevices, timeElapsed);
      effectivePowerRate = 0;
      powerVolume = calculatePowerVolume(powerVolume, effectivePowerRate, powerCapacity, timeElapsed);
    }
    timestep = _timestep;
    stepLinkedDevices(linkedDevices, _timestep);
  }

  /**
   * Establish a bi-directional link between this device and a another device.
   * @param {Device} _device  Another device
   */
  function link(_device) {
    if (linkedDevices.indexOf(_device) >= 0) {
      return;
    }
    linkedDevices.push(_device);
    _device.link(this);
  }

  function turnOn() {
    on = true;
    // TODO: Should only be able to turn on once
    // 1. The power flow is sufficient
    // 2. The power rate is sufficient
  }

  function turnOff() {
    on = false;
  }

  /**
   * Start linked devices if not started.
   * @param {array} _linkedDevices  Array of devices.
   */
  function startLinkedDevices(_linkedDevices) {
    for (var i = 0; i < _linkedDevices.length; i++) {
      var device = _linkedDevices[i];
      if (!device.hasStarted()) {
        device.start(0);
      }
    }
  }

  /**
   * Step the simulation for a list of devices, ensuring that each has started.
   * @param {array} _linkedDevices  Array of devices.
   * @param {int}   _timestep       Timestep of the simulation.
   */
  function stepLinkedDevices(_linkedDevices, _timestep) {
    for (var i = 0; i < _linkedDevices.length; i++) {
      if (_linkedDevices[i].getTimestep() !== _timestep) {
        _linkedDevices[i].step(_timestep);
      }
    }
  }

  /**
   * Heat can only be in the range [-100,100]
   * @param {double} _heatRate      Heat rate
   * @param {array}  _linkedDevices All linked devices.
   * @param {int}    _timeElapsed   Time elapsed since begin of simulation.
   * @returns {double}
   */
  function limitHeat(_heatRate, _linkedDevices, _timeElapsed) {
    var effectiveHeatRate = _heatRate;

    for (var i = 0; i < _linkedDevices.length; i++) {
      effectiveHeatRate += linkedDevices[i].getHeatRate();
    }

    var _heat = effectiveHeatRate * _timeElapsed;
    if (_heat < -100) {
      return -100;
    } else if (_heat > 100) {
      return 100;
    }
    return _heat;
  }

  /**
   * Efficiency decreases with increased heat, and increases with decreased
   * heat. 0% efficiency up to 200% efficiency.
   * @param {double} _powerRate   Rate of power per timestep.
   * @param {double} _heat        Current heat.
   * @returns {double}
   */
  function calculateEffectivePowerRate(_powerRate, _heat) {
    return _powerRate * (200 - (_heat + 100)) / 100.0;
  }

  /**
   * Calculate power volume at current timestep.
   * @param {double} _powerVolume   
   * @param {double} _effectivePowerRate
   * @param {double} _powerCapacity
   * @param {double} _timeElapsed
   * @returns {double}
   */
  function calculatePowerVolume(_powerVolume, _effectivePowerRate, _powerCapacity, _timeElapsed) {
    _powerVolume = _powerVolume + (_effectivePowerRate * _timeElapsed);
    if (_powerVolume < 0) {
      return 0;
    }
    if (_powerVolume > _powerCapacity) {
      return _powerCapacity;
    }
    return _powerCapacity;
  }

  return {
    start: start,
    step: step,
    link: link,
    turnOn: turnOn,
    turnOff: turnOff,
    hasStarted: function () {
      return started;
    },
    isOn: function () {
      return on;
    },
    getHeat: function () {
      return heat;
    },
    getEffectivePowerRate: function () {
      if (on) {
        return effectivePowerRate;
      } else {
        return 0;
      }
    },
    getPowerVolume: function () {
      return powerVolume;
    },
    getHeatRate: function () {
      if (on) {
        return heatRate;
      } else {
        return 0;
      }
    },
    getTimestep: function () {
      return timestep;
    }
  };

};

module.exports = Device;