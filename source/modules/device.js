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
          effectivePowerRate, powerVolume, heat, timestep, linkedDevices;

  powerRate = _powerRate;
  powerFlow = _powerFlow;
  powerCapacity = _powerCapacity;
  heatRate = _heatRate;
  linkedDevices = [];

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
  }

  /**
   * Calculate current values for given timestep.
   * @param {int} _timestep   Simulation current time.
   */
  function step(_timestep) {
    var timeElapsed = _timestep - timestep;

    heat = limitHeat(heatRate, timeElapsed);
    effectivePowerRate = calculateEffectivePowerRate(powerRate, heat);
    powerVolume = calculatePowerVolume(powerVolume, effectivePowerRate, powerCapacity, timeElapsed);
  }

  /**
   * Heat can only be in the range [-100,100]
   * @param {double} _heatRate      Heat rate
   * @param {int}    _timeElapsed   Time elapsed since begin of simulation.
   * @returns {double}
   */
  function limitHeat(_heatRate, _timeElapsed) {
    var _heat = _heatRate * _timeElapsed;
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
    getHeat: function () {
      return heat;
    },
    getEffectivePowerRate: function () {
      return effectivePowerRate;
    },
    getPowerVolume: function () {
      return powerVolume;
    },
    linkDevice: function(_device) {
      linkedDevices.push(_device);
    }
  };
  
};

module.exports = Device;