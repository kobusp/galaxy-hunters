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
 * @param {double}  _powerRate      Rate of power production per timestep. Affected by heat.
 * @param {double}  _powerFlow      Strength of power supply.
 * @param {double}  _powerCapacity  Amount of power that can be stored.
 * @param {double}  _heatRate       Amount of heat produced per timestep.
 * @param {boolean} _autoOn         Turn on when enough power is available. Default true.
 * @type type
 */
var Device = function (_powerRate, _powerFlow, _powerCapacity, _heatRate, _autoOn) {
  var powerRate, powerFlow, powerCapacity, heatRate,
          effectivePowerRate, powerVolume, heat, timestep, initialTimestep,
          linkedDevices, started, on, autoOn;

  powerRate = _powerRate;
  powerFlow = _powerFlow;
  powerCapacity = _powerCapacity;
  heatRate = _heatRate;
  linkedDevices = [];
  started = false;
  autoOn = _autoOn !== false;
  on = autoOn;

  /**
   * PUBLIC
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

    if (!hasEnoughPowerFlowToTurnOn(powerFlow, linkedDevices)) {
      turnOff();
    }

    startLinkedDevices(linkedDevices);
  }

  /**
   * PUBLIC
   * Calculate current values for given timestep. Step any linked devices by the
   * same amount to synchronize the simulation. If any linked devices haven't
   * started, start them.
   * @param {int} _timestep   Simulation current time.
   */
  function step(_timestep) {
    if (!started) {
      start(0);
    }

    var timeElapsed = _timestep - timestep;

    if (!hasEnoughPowerFlowToTurnOn(powerFlow, linkedDevices)) {
      turnOff();
    } else if (autoOn) {
      turnOn();
    }

    if (on) {
      heat = calculateHeat(heat, heatRate, linkedDevices, timeElapsed);
      effectivePowerRate = calculateEffectivePowerRate(powerRate, heat);
    } else {
      heat = calculateHeat(heat, 0, linkedDevices, timeElapsed);
      effectivePowerRate = 0;
    }
    powerVolume = calculatePowerVolume(powerVolume, effectivePowerRate,
            powerCapacity, timeElapsed);
    timestep = _timestep;
    stepLinkedDevices(linkedDevices, _timestep);
  }

  /**
   * PUBLIC
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

  /**
   * PUBLIC
   * TODO: Should only be able to turn on once the following conditions are met:
   *    1. The power flow is sufficient
   *    2. The power rate is sufficient
   * Turn the device on. Returns false if it could not be powered up.
   * @returns {boolean}
   */
  function turnOn() {
    on = true;
    return on;
  }

  /**
   * PUBLIC
   * Turn the device off.
   * @returns {boolean}
   */
  function turnOff() {
    on = false;
    autoOn = false;
    return on;
  }

  /**
   * PRIVATE
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
   * PRIVATE
   * Step the simulation for a list of devices, ensuring that each has started.
   * @param {array} _linkedDevices  Array of devices.
   * @param {int}   _timestep       Timestep of the simulation.
   */
  function stepLinkedDevices(_linkedDevices, _timestep) {
    for (var i = 0; i < _linkedDevices.length; i++) {
      var device = _linkedDevices[i];
      if (device.getTimestep() !== _timestep) {
        device.step(_timestep);
      }
    }
  }

  /**
   * PRIVATE
   * Heat can only be in the range [-100,100]
   * @param {double} _heat          Current heat value
   * @param {double} _heatRate      Heat rate
   * @param {array}  _linkedDevices All linked devices.
   * @param {int}    _timeElapsed   Time elapsed since begin of simulation.
   * @returns {double}
   */
  function calculateHeat(_heat, _heatRate, _linkedDevices, _timeElapsed) {
    var effectiveHeatRate = _heatRate;

    for (var i = 0; i < _linkedDevices.length; i++) {
      effectiveHeatRate += linkedDevices[i].getHeatRate();
    }

    _heat = _heat + effectiveHeatRate * _timeElapsed;
    return limit(_heat, -100, 100);
  }

  /**
   * PRIVATE
   * Limit a number between a set range.
   * TODO: Move this to a utility class.
   * @param {double} number   Number to limit.
   * @param {double} min      Minimum.
   * @param {double} max      Maximum.
   * @returns {double}
   */
  function limit(number, min, max) {
    if (number < min) {
      return min;
    } else if (number > max) {
      return max;
    }
    return number;
  }

  /**
   * PRIVATE
   * Calculate whether directly linked devices produce together enough power 
   * flow to turn on automatically. Can only add up the power flow of those 
   * devices which are on.
   * If the device has a positive flow, it should always return true.
   * @param {double} _powerFlow     Current device power flow
   * @param {array}  _linkedDevices List of linked devices
   * @returns {boolean}
   */
  function hasEnoughPowerFlowToTurnOn(_powerFlow, _linkedDevices) {
    if (_powerFlow >= 0) {
      return true;
    }
    var totalPowerFlow = _powerFlow;
    for (var i = 0; i < _linkedDevices.length; i++) {
      var device = _linkedDevices[i];
      totalPowerFlow += device.getPowerFlow();
    }
    return totalPowerFlow >= 0;
  }

  /**
   * PRIVATE
   * Efficiency decreases with increased heat, and increases with decreased
   * heat. 0% efficiency up to 200% efficiency.
   * @param {double} _powerRate   Rate of power per timestep.
   * @param {double} _heat        Current heat.
   * @returns {double}
   */
  function calculateEffectivePowerRate(_powerRate, _heat) {
    return _powerRate * (200.0 - (_heat + 100.0)) / 100.0;
  }

  /**
   * PRIVATE
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
    isAutoOn: function () {
      return autoOn;
    },
    getHeat: function () {
      return heat;
    },
    getPowerFlow: function () {
      if (on) {
        return powerFlow;
      }
      return 0;
    },
    getEffectivePowerRate: function () {
      if (on) {
        return effectivePowerRate;
      }
      return 0;
    },
    getPowerVolume: function () {
      return powerVolume;
    },
    getHeatRate: function () {
      if (on) {
        return heatRate;
      }
      return 0;
    },
    getTimestep: function () {
      return timestep;
    }
  };

};

module.exports = Device;