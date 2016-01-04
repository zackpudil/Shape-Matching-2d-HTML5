import {} from './ext/array.ext.js';

import Vector from './math2d/vector';
import Matrix from './math2d/matrix';

import Body from './phys/body';
import Particle from './phys/particle';

import AABB from './collision/aabb';
import Detector from './collision/detector';

import Actor from './world/actor';
import Bounds from './world/bounds';
import Renderer from './world/renderer';
import Scene from './world/scene';

import Debugger from './debug/debugger';

window.Vector = Vector;
window.Matrix = Matrix;

window.Body = Body;
window.Particle = Particle;

window.AABB = AABB;
window.Detector = Detector;

window.Actor = Actor;
window.Bounds = Bounds;
window.Renderer = Renderer;
window.Scene = Scene;

window.Debugger = Debugger;