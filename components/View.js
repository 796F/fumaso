/**
 * View class that extends Modifier and should be used for visual elements.
 */

const Color = FamousPlatform.utilities.Color;
const Transitionable = FamousPlatform.transitions.Transitionable;
const DOMElement = FamousPlatform.domRenderables.DOMElement;
const DynamicGeometry = FamousPlatform.webglGeometries.DynamicGeometry;
const Geometry = FamousPlatform.webglGeometries.Geometry;
const Mesh = FamousPlatform.webglRenderables.Mesh;
const OBJLoader = FamousPlatform.webglGeometries.OBJLoader;
const Align = FamousPlatform.components.Align;
const FamousEngine = FamousPlatform.core.FamousEngine;
const MountPoint = FamousPlatform.components.MountPoint;
const Opacity = FamousPlatform.components.Opacity;
const Origin = FamousPlatform.components.Origin;
const Position = FamousPlatform.components.Position;
const Rotation = FamousPlatform.components.Rotation;
const Scale = FamousPlatform.components.Scale;
const Size = FamousPlatform.components.Size;

/**
 * Converts raw text from an OBJ into a DynamicGeometry.
 * @method  objToGeometry
 * @param   {String}           rawText  The raw text from an OBJ file.
 * @return  {DynamicGeometry}  The new DynamicGeometry from the OBJ.
 */
function objToGeometry(rawText, options) {
  let buffers = OBJLoader.formatText(rawText, options);
  let geometry = new Geometry({
    buffers: [
      { name: 'a_pos', data: buffers[0].vertices, size: 3 },
      { name: 'a_normals', data: buffers[0].normals, size: 3 },
      { name: 'a_texCoord', data: buffers[0].textureCoords, size: 2 },
      { name: 'indices', data: buffers[0].indices, size: 1 }
    ]
  });
  return geometry;
}

export default class View {
  constructor(node, options) {
    this.node = node;
    this.options = options;
    this.id = this.node.getLocation();
  }

  // ---------------------------------------------------------------------------
  // DOM Creation and Modifiers
  validateDOM(options) {
    if (!this.el) {
      this._events = {};
      this.el = new DOMElement(this.node, options);
      this.el.onReceive = (event, payload) => {
        if (this._events[event]) {
          this._events[event](payload);
        }
      };
    }
  }
  createDOMElement(options) {
    this.validateDOM(options);
    return this;
  }
  setDOMContent(content) {
    this.validateDOM();
    this.el.setContent(content);
    return this;
  }
  setDOMClasses(classes) {
    this.validateDOM();
    for (let i = 0; i < classes.length; i++) {
      this.el.addClass(classes[i]);
    }
    return this;
  }
  setDOMAttributes(attributes) {
    this.validateDOM();
    for (let attrName in attributes) {
      this.el.setAttribute(attrName, attributes[attrName]);
    }
    return this;
  }
  setDOMProperties(properties) {
    this.validateDOM();
    for (let propertyName in properties) {
      this.el.setProperty(propertyName, properties[propertyName]);
    }
    return this;
  }

  setCutoutState(useCutout) {
    this.validateDOM()
    this.el.setCutoutState(useCutout);
  }

  on(evName, fn) {
    this.validateDOM();
    this.node.addUIEvent(evName);
    this._events[evName] = fn;
    return this;
  }

  // ---------------------------------------------------------------------------
  // WebGL Mesh Creation and Modifiers
  validateMesh() {
    if (!this.mesh) this.mesh = new Mesh(this.node);
  }
  // Mesh Getters
  getMeshBaseColor() {
    this.validateMesh();
    return this.mesh.getBaseColor();
  }
  getMeshDrawOptions() {
    this.validateMesh();
    return this.mesh.getDrawOptions();
  }
  getMeshFlatShading() {
    this.validateMesh();
    return this.mesh.getFlatShading();
  }
  getMeshGeometry() {
    this.validateMesh();
    return this.mesh.getGeometry();
  }
  getMeshGlossiness() {
    this.validateMesh();
    return this.mesh.getGlossiness();
  }
  getMeshMaterialExpressions() {
    this.validateMesh();
    return this.mesh.getMaterialExpressions();
  }
  getMeshNormals(materialExpression) {
    this.validateMesh();
    return this.mesh.getNormals(materialExpression);
  }
  getMeshPositionOffset(materialExpression) {
    this.validateMesh();
    return this.mesh.getPositionOffset(materialExpression);
  }
  getMeshValue() {
    this.validateMesh();
    return this.mesh.getValue();
  }

  setBaseColor(color, transition, callback) {
    this.validateMesh();
    if(!this.baseColor) {
      this.baseColor = (Color.isColorInstance(color)) ? color : new Color(color);
      this.mesh.setBaseColor(this.baseColor);
    }
    this.baseColor.set(color, transition, callback);
    return this;
  }

  setSpecularColor(color, strength, transition, callback) {
    this.validateMesh();
    if(!this.specularColor) {
      this.specularColor = (Color.isColorInstance(color)) ? color : new Color(color);
      this.mesh.setGlossiness(this.specularColor, strength);
    }
    this.specularColor.set(color, transition, callback);
    return this;
  }

  setMeshDrawOptions(options) {
    this.validateMesh();
    this.mesh.setDrawOptions(options);
    return this;
  }
  setMeshFlatShading(bool) {
    this.validateMesh();
    this.mesh.setFlatShading(bool);
    return this;
  }
  setMeshOptions(options) {
    this.validateMesh();
    this.mesh.setOptions(options);
    return this;
  }
  setMeshPositionOffset(materialExpression) {
    this.validateMesh();
    this.mesh.setPositionOffset(materialExpression);
    return this;
  }
  setGeometry(geometry, options) {
    this.validateMesh();
    this.geometry = geometry;
    this.mesh.setGeometry(geometry, options);
    return this;
  }

  // ---------------------------------------------------------------------------
  // WebGL Geometry
  // Geometry Getters
  getGeometryLength() { return this.geometry.getLength(); }
  getNormals() { return this.geometry.getNormals(); }
  getTextureCoords() { return this.geometry.getTextureCoords(); }
  getVertexBuffer(bufferName) { return this.geometry.getVertexBuffer(bufferName); }
  getVertexPositions() { return this.geometry.getVertexPositions(); }
  // Geometry Setters
  fromGeometry(geometry) {
    this.geometry.fromGeometry(geometry);
    this.setGeometry(this.geometry);
    return this;
  }
  setDrawType(value) {
    this.geometry.setDrawType(value);
    this.setGeometry(this.geometry);
    return this;
  }
  setIndices(indices) {
    this.geometry.setIndices(indices);
    this.setGeometry(this.geometry);
    return this;
  }
  setNormals(normals) {
    this.geometry.setNormals(normals);
    this.setGeometry(this.geometry);
    return this;
  }
  setTextureCoords(textureCoords) {
    this.geometry.setTextureCoords(textureCoords);
    this.setGeometry(this.geometry);
    return this;
  }
  setVertexBuffer(bufferName, value, size) {
    this.geometry.setVertexBuffer(bufferName, value, size);
    this.setGeometry(this.geometry);
    return this;
  }
  setVertexPositions(vertices) {
    this.geometry.setVertexPositions(vertices);
    this.setGeometry(this.geometry);
    return this;
  }

  
  getChildren() { return this.node.getChildren(); }
  getComputedValue() { return this.getComputedValue(); }
  getId() { return this.node.getLocation(); }
  getParent() { return this.node.getParent(); }
  getValue() { return this.node.getValue(); }
  isMounted() { return this.node.isMounted(); }
  isShown() { return this.node.isShown(); }
  addChild(child) { return this.node.addChild(child); }
  removeChild(child) { return this.node.removeChild(child); }
  
  hide() {
    this.node.hide(); return this;
  }
  
  show() {
    this.node.show(); return this;
  }

  requestUpdate(requester) {
    FamousEngine.requestUpdate(requester);
    return this;
  }
  requestUpdateOnNextTick(requester) {
    FamousEngine.requestUpdateOnNextTick(requester);
    return this;
  }

  validateAlign() {
    if (!this.align) this.align = new Align(this.node);
  }
  haltAlign() {
    this.validateAlign();
    this.align.halt();
    return this;
  }
  getAlignValue() {
    this.validateAlign();
    return this.align.getValue();
  }
  getAlignX() {
    this.validateAlign();
    return this.align.getX();
  }

  getAlignY() {
    this.validateAlign();
    return this.align.getY();
  }
  getAlignZ() {
    this.validateAlign();
    return this.align.getZ();
  }

  setAlign() {
    this.validateAlign();
    this.align.set(...arguments);
    return this;
  }
  setAlignX() {
    this.validateAlign();
    this.align.setX(...arguments);
    return this;
  }
  setAlignY() {
    this.validateAlign();
    this.align.setY(...arguments);
    return this;
  }
  setAlignZ() {
    this.validateAlign();
    this.align.setZ(...arguments);
    return this;
  }

  // ---------------------------------------------------------------------------
  // helpers for mount point
  validateMountPoint() {
    if (!this.mountpoint) this.mountpoint = new MountPoint(this.node);
  }
  getMountPointValue() {
    this.validateMountPoint();
    return this.mountpoint.getValue();
  }
  getMountPointX() {
    this.validateMountPoint();
    return this.mountpoint.getX();
  }
  getMountPointY() {
    this.validateMountPoint();
    return this.mountpoint.getY();
  }
  getMountPointZ() {
    this.validateMountPoint();
    return this.mountpoint.getZ();
  }
  setMountPoint() {
    this.validateMountPoint();
    this.mountpoint.set(...arguments);
    return this;
  }
  setMountPointX() {
    this.validateMountPoint();
    this.mountpoint.setX(...arguments);
    return this;
  }
  setMountPointY() {
    this.validateMountPoint();
    this.mountpoint.setY(...arguments);
    return this;
  }
  setMountPointZ() {
    this.validateMountPoint();
    this.mountpoint.setZ(...arguments);
    return this;
  }

  // ---------------------------------------------------------------------------
  // helpers for opacity
  validateOpacity() {
    if (!this.opacity) this.opacity = new Opacity(this.node);
  }
  // Opacity getters
  getOpacityValue() {
    this.validateOpacity();
    return this.opacity.getValue();
  }
  getOpacity() {
    this.validateOpacity();
    return this.opacity.get();
  }
  setOpacity() {
    this.validateOpacity();
    this.opacity.set(...arguments);
    return this;
  }

  // ---------------------------------------------------------------------------
  // helpers for origin
  validateOrigin() {
    if (!this.origin) this.origin = new Origin(this.node);
  }
  // Origin getters
  getOriginValue() {
    this.validateOrigin();
    return this.origin.getValue();
  }
  getOriginX() {
    this.validateOrigin();
    return this.origin.getX();
  }
  getOriginY() {
    this.validateOrigin();
    return this.origin.getY();
  }
  getOriginZ() {
    this.validateOrigin();
    return this.origin.getZ();
  }
  setOrigin() {
    this.validateOrigin();
    this.origin.set(...arguments);
    return this;
  }
  setOriginX() {
    this.validateOrigin();
    this.origin.setX(...arguments);
    return this;
  }
  setOriginY() {
    this.validateOrigin();
    this.origin.setY(...arguments);
    return this;
  }
  setOriginZ() {
    this.validateOrigin();
    this.origin.setZ(...arguments);
    return this;
  }

  // ---------------------------------------------------------------------------
  // helpers for position
  validatePosition() {
    if (!this.position) this.position = new Position(this.node);
  }
  // Position getters
  getPositionValue() {
    this.validatePosition();
    return this.position.getValue();
  }
  getPositionX() {
    this.validatePosition();
    return this.position.getX();
  }
  getPositionY() {
    this.validatePosition();
    return this.position.getY();
  }
  getPositionZ() {
    this.validatePosition();
    return this.position.getZ();
  }
  setPosition() {
    this.validatePosition();
    this.position.set(...arguments);
    return this;
  }
  setPositionX() {
    this.validatePosition();
    this.position.setX(...arguments);
    return this;
  }
  setPositionY() {
    this.validatePosition();
    this.position.setY(...arguments);
    return this;
  }
  setPositionZ() {
    this.validatePosition();
    this.position.setZ(...arguments);
    return this;
  }

  // ---------------------------------------------------------------------------
  // helpers for rotation
  validateRotation() {
    if (!this.rotation) this.rotation = new Rotation(this.node);
  }
  // Rotation getters
  getRotationValue() {
    this.validateRotation();
    let val = this.rotation.getValue();
    val.x = this.getRotationVal(val.x);
    val.y = this.getRotationVal(val.y);
    val.z = this.getRotationVal(val.z);
    return val;
  }
  getRotationX() {
    this.validateRotation();
    return this.getRotationVal(this.rotation.getX());
  }
  getRotationY() {
    this.validateRotation();
    return this.getRotationVal(this.rotation.getY());
  }
  getRotationZ() {
    this.validateRotation();
    return this.getRotationVal(this.rotation.getZ());
  }
  setRotation(x, y, z, options, callback) {
    this.validateRotation();
    this.rotation.set(x, y, z, options, callback);
    return this;
  }
  setRotationX(val, options, callback) {
    this.validateRotation();
    this.rotation.setX(this.setRotationVal(val), options, callback);
    return this;
  }
  setRotationY(val, options, callback) {
    this.validateRotation();
    this.rotation.setY(this.setRotationVal(val), options, callback);
    return this;
  }
  setRotationZ(val, options, callback) {
    this.validateRotation();
    let value = this.setRotationVal(val);
    this.rotation.setZ(value, options, callback);
    return this;
  }

  // ---------------------------------------------------------------------------
  // helpers for scale
  validateScale() {
    if (!this.scale) this.scale = new Scale(this.node);
  }
  // Scale getters
  getScaleValue() {
    this.validateScale();
    return this.scale.getValue();
  }
  getScaleX() {
    this.validateScale();
    return this.scale.getX();
  }
  getScaleY() {
    this.validateScale();
    return this.scale.getY();
  }
  getScaleZ() {
    this.validateScale();
    return this.scale.getZ();
  }
  setScale() {
    this.validateScale();
    this.scale.set(...arguments);
    return this;
  }
  setScaleX() {
    this.validateScale();
    this.scale.setX(...arguments);
    return this;
  }
  setScaleY() {
    this.validateScale();
    this.scale.setY(...arguments);
    return this;
  }
  setScaleZ() {
    this.validateScale();
    this.scale.setZ(...arguments);
    return this;
  }

  // ---------------------------------------------------------------------------
  // helpers for size
  validateSize() {
    if (!this.size) this.size = new Size(this.node);
  }
  // Size getters
  getSizeValue() {
    this.validateSize();
    return this.size.getValue();
  }
  getSize() {
    this.validateSize();
    return this.size.get();
  }
  setDifferentialSize() {
    this.validateSize();
    this.size.setDifferential(...arguments);
    return this;
  }
  setProportionalSize() {
    this.validateSize();
    this.size.setProportional(...arguments);
    return this;
  }
  setAbsoluteSize() {
    this.validateSize();
    this.size.setAbsolute(...arguments);
    return this;
  }
  setSizeMode(x, y, z) {
    this.node.setSizeMode(x, y, z);
    return this;
  }
  setSizeModeAbsolute() {
    this.node.setSizeMode(Size.ABSOLUTE, Size.ABSOLUTE, Size.ABSOLUTE);
    return this;
  }
  setSizeModeRelative() {
    this.node.setSizeMode(Size.RELATIVE, Size.RELATIVE, Size.RELATIVE);
    return this;
  }
  setSizeModeRender() {
    this.node.setSizeMode(Size.RENDER, Size.RENDER, Size.RENDER);
    return this;
  }

  // ---------------------------------------------------------------------------
  // Convenience Methods
  moveTopLeft() {
    this.setAlign(0, 0, 0.5).setMountPoint(0, 0, 0.5).setOrigin(0, 0, 0.5);
    return this;
  }
  moveTopCenter() {
    this.setAlign(0.5, 0, 0.5).setMountPoint(0.5, 0, 0.5).setOrigin(0.5, 0, 0.5);
    return this;
  }
  moveTopRight() {
    this.setAlign(1, 0, 0.5).setMountPoint(1, 0, 0.5).setOrigin(1, 0, 0.5);
    return this;
  }
  moveCenterLeft() {
    this.setAlign(0, 0.5, 0.5).setMountPoint(0, 0.5, 0.5).setOrigin(0, 0.5, 0.5);
    return this;
  }
  moveCenter() {
    this.setAlign(0.5, 0.5, 0.5).setMountPoint(0.5, 0.5, 0.5).setOrigin(0.5, 0.5, 0.5);
    return this;
  }
  moveCenterRight() {
    this.setAlign(1, 0.5, 0.5).setMountPoint(1, 0.5, 0.5).setOrigin(1, 0.5, 0.5);
    return this;
  }
  moveBottomLeft() {
    this.setAlign(0, 1, 0.5).setMountPoint(0, 1, 0.5).setOrigin(0, 1, 0.5);
    return this;
  }
  moveBottomCenter() {
    this.setAlign(0.5, 1, 0.5).setMountPoint(0.5, 1, 0.5).setOrigin(0.5, 1, 0.5);
    return this;
  }
  moveBottomRight() {
    this.setAlign(1, 1, 0.5).setMountPoint(1, 1, 0.5).setOrigin(1, 1, 0.5);
    return this;
  }
}
