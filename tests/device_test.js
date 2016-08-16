/* =============================================================================
 * @date 2016-08-16
 * @author Kobus Pretorius
 * =============================================================================
 */
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var Device = require('../source/modules/device');

describe('Device', function () {
  var powerRate = 1.0;
  var powerFlow = 100;
  var powerCapacity = 50;
  var heatRate = 0.5;

  it('device.getHeat() should return 0 when simulation starts', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    device.start(Math.random(1000));
    expect(device.getHeat()).to.equal(0);
  });

  it('device.getEffectivePowerRate() should return ' + powerRate + ' when simulation starts', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    device.start(0);
    expect(device.getEffectivePowerRate()).to.equal(powerRate);
  });

  it('device.getPowerVolume() should return ' + powerCapacity + ' when simulation starts', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    device.start(0);
    expect(device.getPowerVolume()).to.equal(powerCapacity);
  });

  it('device.getHeat() should return 2 at timestep 4', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    device.start(0);
    device.step(4);
    expect(device.getHeat()).to.equal(2);
  });

  it('device.getEffectivePowerRate() should return 0.9 at timestep 20', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    device.start(0);
    device.step(20);
    expect(device.getEffectivePowerRate()).to.equal(0.9);
  });
});