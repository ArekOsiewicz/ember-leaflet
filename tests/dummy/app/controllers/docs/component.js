import Ember from 'ember';
/* global require, requirejs */

const { Controller, Component, computed, A } = Ember;

let URL_PREFIX = 'http://leafletjs.com/reference-1.0.2.html#';

export default Controller.extend({

  leafletUrlPrefix: computed('componentName', function() {
    let id;
    let componentName = this.get('componentName');
    if (componentName === 'leaflet-map') {
      id = 'map';
    } else if (componentName === 'tile-layer') {
      id = 'tilelayer';
    } else if (componentName === 'path-layer') {
      id = 'path';
    } else if (componentName.endsWith('-layer')) {
      [id] = componentName.split('-');
    }

    return URL_PREFIX + id;
  }),

  _findClassSource(klass) {
    for (let key in requirejs.entries) {
      if (key.indexOf('ember-leaflet/components/') !== -1) {
        let module = require(key);

        for (let exported in module) {
          if (module[exported] === klass) {
            return key;
          }
        }
      }
    }

    return false;
  },

  _subtractSuperClassProps(propName) {
    let component = this.get('component');
    let props = component.get(propName) ? A(component.get(propName).slice(0)) : A();
    let clazz = component.constructor.superclass.superclass;

    // subtract superclass properties
    while (clazz !== Component) {
      let classProps = clazz.prototype[propName] || [];
      props.removeObjects(classProps);
      clazz = clazz.superclass;
    }

    return props;
  },

  superclassName: computed('component', function() {
    let component = this.get('component');
    let { constructor: { superclass: { superclass } } } = component;
    if (superclass !== Component) {
      return this._findClassSource(superclass).split('/').pop();
    } else {
      return false;
    }
  }),

  leafletRequiredOptions: computed('component', function() {
    let component = this.get('component');
    return component.get('leafletRequiredOptions');
  }),

  leafletProperties: computed('component', function() {
    return this._subtractSuperClassProps('leafletProperties');
  }),

  leafletOptions: computed('component', function() {
    return this._subtractSuperClassProps('leafletOptions');
  }),

  leafletEvents: computed('component', function() {
    return this._subtractSuperClassProps('leafletEvents');
  }),

  leafletStyleProperties: computed('component', function() {
    return this._subtractSuperClassProps('leafletStyleProperties');
  })

});
