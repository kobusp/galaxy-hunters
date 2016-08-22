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
  var heatRate2 = -0.1;
  
  function round(n) {
    return Math.round(n * 100000) / 100000.0;
  }

  it('device.getHeat() should return 0 when simulation starts', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    device.start(Math.random(1000));
    expect(device.getHeat()).to.equal(0);
  });

  it('device.getEffectivePowerRate() should return ' + powerRate + ' when simulation starts', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    device.turnOn();
    device.start(0);
    expect(device.getEffectivePowerRate()).to.equal(powerRate);
  });

  it('device.getPowerVolume() should return ' + powerCapacity + ' when simulation starts', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    device.turnOn();
    device.start(0);
    expect(device.getPowerVolume()).to.equal(powerCapacity);
  });

  it('device.getHeat() should return 2 at timestep 4', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    device.turnOn();
    device.start(0);
    device.step(4);
    expect(device.getHeat()).to.equal(2);
  });

  it('device.getEffectivePowerRate() should return 0.9 at timestep 20', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    device.turnOn();
    device.start(0);
    device.step(20);
    expect(device.getEffectivePowerRate()).to.equal(0.9);
  }); 
  
  it('reactor.getHeat() should return 1.6 at timestep 4 and should start linked radiator', function () {
    var reactor = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    var radiator = new Device(powerRate, powerFlow, powerCapacity, heatRate2);
    reactor.turnOn();
    radiator.turnOn();
    reactor.link(radiator);
    reactor.start(0);    // Start only the first device
    reactor.step(4);
    
    expect(reactor.getHeat()).to.equal(1.6);   // Heat rate should be averaged between the devices
    expect(radiator.getHeat()).to.equal(1.6);
  });
  
  
  it('reactor.getHeat() should return 1.2 at timestep 4 and should start linked radiators', function () {
    var reactor = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    var radiator = new Device(powerRate, powerFlow, powerCapacity, heatRate2);
    var radiator2 = new Device(powerRate, powerFlow, powerCapacity, heatRate2);
    reactor.turnOn();
    radiator.turnOn();
    radiator2.turnOn();
    reactor.link(radiator);
    reactor.link(radiator2);
    radiator.link(radiator2);
    reactor.start(0);    // Start only the first device
    reactor.step(4);
    expect(round(reactor.getHeat())).to.equal(1.2);   // Heat rate should be averaged between the devices
    expect(round(radiator.getHeat())).to.equal(1.2);
    expect(round(radiator2.getHeat())).to.equal(1.2);
  });
  
});