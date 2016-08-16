/**
 * =============================================================================
 * Galaxy Hunters v1 - Tests: Modules: Entity
 * =============================================================================
 * @date 2016-08-11
 * @author Kobus Pretorius
 * =============================================================================
 */
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var Entity = require('../source/modules/entity');

describe('Entity', function () {
  it('entity.distance(entity) should return 4 and not be a string', function () {
    var entity1 = new Entity(0,0);
    var entity2 = new Entity(3,4); 
    
    expect(entity1.distance(entity2)).to.equal(5.0);
    
    entity1.setXY(1, 1);
    entity2.setXY(4, 5);
    expect(entity1.distance(entity2)).to.equal(5.0);
    expect(entity1.distance(entity2)).to.not.be.a("string");
  }); 
  
  it('entity.getX() should return 5', function () {
    var entity = new Entity(5,3);
    entity.x = 1;
    entity.y = 3;
    expect(entity.getX()).to.equal(5);
  });
});


