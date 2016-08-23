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
  var thusterPowerFlow = -200;

  function round(n) {
    return Math.round(n * 100000) / 100000.0;
  }

  // Simulation should start automatically

  it('device.step(n) should automatically start the simulation at 0', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    device.step(1);
    expect(device.hasStarted()).to.equal(true);
  });
  
  // All devices start with zero heat

  it('device.getHeat() should return 0 when simulation starts', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    device.start(Math.random(1000));
    expect(device.getHeat()).to.equal(0);
  });
  
  // Effective power rate should be the same as the basic power rate at the start

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
    device.step(1);
    device.step(2);
    device.step(3); 
    device.step(4);
    expect(device.getHeat()).to.equal(2);
  });
  
  it('device.getHeat() should return 1 at timestep 4 when turned off for 2 timesteps', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    device.start(0);
    device.step(2);
    device.turnOff();
    expect(device.getHeat()).to.equal(1);
    device.step(3);
    expect(device.getHeat()).to.equal(1);
    device.step(4);
//    expect(device.getHeat()).to.equal(1);
  });

  it('device.getEffectivePowerRate() should return 0.9 at timestep 20', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    device.start(0);
    device.step(20);
    expect(device.getEffectivePowerRate()).to.equal(0.9);
  });

  it('reactor.getHeat() should return 1.6 at timestep 4 and should start linked radiator', function () {
    var reactor = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    var radiator = new Device(powerRate, powerFlow, powerCapacity, heatRate2);
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
    reactor.link(radiator);
    reactor.link(radiator2);
    radiator.link(radiator2);
    reactor.start(0);    // Start only the first device, should start the rest.
    reactor.step(4);
    expect(round(reactor.getHeat())).to.equal(1.2);   // Heat rate should be averaged between the devices
    expect(round(radiator.getHeat())).to.equal(1.2);
    expect(round(radiator2.getHeat())).to.equal(1.2);
  });

  // Min and max heat

  it('device.getHeat() should never get higher than 100', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    device.start(0);
    device.step(100);
    expect(device.getHeat()).to.be.lte(100);
    device.step(100000);
    expect(device.getHeat()).to.be.lte(100);
  });

  it('device.getHeat() should never get lower than -100', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate2);
    device.start(0);
    device.step(100);
    expect(device.getHeat()).to.be.gte(-100);
    device.step(100000);
    expect(device.getHeat()).to.be.gte(-100);
  });

  // Auto on feature

  it('device.isAutoOn() should be true by default', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    expect(device.isAutoOn()).to.equal(true);
  });

  it('device.isAutoOn() should be false when set', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate, false);
    expect(device.isAutoOn()).to.equal(false);
  });

  it('device.isAutoOn() should be true when set', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate, true);
    expect(device.isAutoOn()).to.equal(true);
  });
  
  it('device.isAutoOn() should be false when device is turned off', function () {
    var device = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    expect(device.isAutoOn()).to.equal(true);
    // Turn off then auto-on should be false
    device.turnOff();
    expect(device.isAutoOn()).to.equal(false);
  });

  // Minimum power requirements
  
  it('thruster.isOn() should be false when reactor power flow is insufficient', function () {
    var reactor = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    var thruster = new Device(powerRate, thusterPowerFlow, powerCapacity, heatRate);
    
    reactor.link(thruster);
    expect(reactor.isOn()).to.equal(true);
    expect(thruster.isOn()).to.equal(true);
    
    // Start the simulation and thruster should turn off.
    reactor.start(0);
    expect(reactor.isOn()).to.equal(true);
    expect(thruster.isOn()).to.equal(false);
  });
  
  it('thuster.isOn() should be true when reactor power flow is sufficient', function () {
    var reactor = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    var reactor2 = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    var thruster = new Device(powerRate, thusterPowerFlow, powerCapacity, heatRate);
    
    reactor.link(thruster);
    reactor2.link(thruster);
    
    // Start the simulation then two reactors should be strong enough to power the thruster
    reactor.start(0);
    expect(reactor.isOn()).to.equal(true);
    expect(reactor2.isOn()).to.equal(true);
    expect(thruster.isOn()).to.equal(true);
  });
  
  it('thuster.isOn() should be true when reactor power flow is sufficient then turn off when reactor is turned off', function () {
    var reactor = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    var reactor2 = new Device(powerRate, powerFlow, powerCapacity, heatRate);
    var thruster = new Device(powerRate, thusterPowerFlow, powerCapacity, heatRate);
    
    reactor.link(thruster);
    reactor2.link(thruster);
    
    // Start the simulation and the thruster should have enough power flow to turn on.
    reactor.start(0);
    expect(reactor.isOn()).to.equal(true);
    expect(reactor2.isOn()).to.equal(true);
    expect(thruster.isOn()).to.equal(true);
    
    // Turn one reactor off, then the thruster should have insufficient power flow.
    reactor.turnOff();
    reactor.step(1);
    expect(reactor.isOn()).to.equal(false);
    expect(reactor2.isOn()).to.equal(true);
    expect(thruster.isOn()).to.equal(false);
  });

  

});