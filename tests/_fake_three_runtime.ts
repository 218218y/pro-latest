type VectorTuple = { x: number; y: number; z: number };

class FakeVector3 implements VectorTuple {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  clone(): FakeVector3 {
    return new FakeVector3(this.x, this.y, this.z);
  }
}

class FakeObject3D {
  children: FakeObject3D[] = [];
  parent: FakeObject3D | null = null;
  position = new FakeVector3();
  rotation = { x: 0, y: 0, z: 0 };
  scale = new FakeVector3(1, 1, 1);
  userData: Record<string, unknown> = {};

  add(obj: FakeObject3D): void {
    obj.parent = this;
    this.children.push(obj);
  }

  updateMatrixWorld(_force?: boolean): void {
    for (const child of this.children) child.updateMatrixWorld(_force);
  }

  updateWorldMatrix(_updateParents?: boolean, updateChildren?: boolean): void {
    if (updateChildren) this.updateMatrixWorld(true);
  }

  traverse(visit: (node: FakeObject3D) => void): void {
    visit(this);
    for (const child of this.children) child.traverse(visit);
  }

  localToWorld(value: VectorTuple): VectorTuple {
    value.x *= this.scale.x;
    value.y *= this.scale.y;
    value.z *= this.scale.z;

    const cosY = Math.cos(this.rotation.y || 0);
    const sinY = Math.sin(this.rotation.y || 0);
    const x = value.x * cosY + value.z * sinY;
    const z = -value.x * sinY + value.z * cosY;
    value.x = x + this.position.x;
    value.y += this.position.y;
    value.z = z + this.position.z;

    if (this.parent) this.parent.localToWorld(value);
    return value;
  }

  worldToLocal(value: VectorTuple): VectorTuple {
    if (this.parent) this.parent.worldToLocal(value);

    let x = value.x - this.position.x;
    let y = value.y - this.position.y;
    let z = value.z - this.position.z;

    const cosY = Math.cos(this.rotation.y || 0);
    const sinY = Math.sin(this.rotation.y || 0);
    const localX = x * cosY - z * sinY;
    const localZ = x * sinY + z * cosY;
    x = localX;
    z = localZ;

    value.x = x / (this.scale.x || 1);
    value.y = y / (this.scale.y || 1);
    value.z = z / (this.scale.z || 1);
    return value;
  }
}

class FakeGroup extends FakeObject3D {}

class FakeBoxGeometry {
  parameters: { width: number; height: number; depth: number };
  boundingBox: { min: FakeVector3; max: FakeVector3 };

  constructor(width: number, height: number, depth: number) {
    this.parameters = { width, height, depth };
    this.boundingBox = {
      min: new FakeVector3(-width / 2, -height / 2, -depth / 2),
      max: new FakeVector3(width / 2, height / 2, depth / 2),
    };
  }
}

class FakeShape {
  points: Array<{ x: number; y: number }> = [];

  moveTo(x: number, y: number): void {
    this.points.push({ x, y });
  }

  lineTo(x: number, y: number): void {
    this.points.push({ x, y });
  }
}

class FakePositionAttribute {
  count = 0;
  needsUpdate = false;

  getX(_index: number): number {
    return 0;
  }

  getZ(_index: number): number {
    return 0;
  }

  setZ(_index: number, _value: number): void {}
}

class FakeExtrudeGeometry {
  parameters: { width: number; height: number; depth: number };
  private readonly positionAttr = new FakePositionAttribute();

  constructor(_shape: FakeShape, opts: { depth?: number } = {}) {
    this.parameters = { width: 0.1, height: 0.1, depth: Number(opts.depth) || 0.1 };
  }

  translate(_x: number, _y: number, _z: number): void {}

  computeVertexNormals(): void {}

  getAttribute(name: string): unknown {
    return name === 'position' ? this.positionAttr : null;
  }
}

class FakeMesh extends FakeObject3D {
  type = 'Mesh';
  isMesh = true;
  geometry: unknown;
  material: unknown;
  castShadow = false;
  receiveShadow = false;

  constructor(geometry: unknown, material: unknown = null) {
    super();
    this.geometry = geometry;
    this.material = material;
  }
}

class FakeMeshBasicMaterial {}

class FakeBox3 {
  min = new FakeVector3(Infinity, Infinity, Infinity);
  max = new FakeVector3(-Infinity, -Infinity, -Infinity);

  makeEmpty(): this {
    this.min.set(Infinity, Infinity, Infinity);
    this.max.set(-Infinity, -Infinity, -Infinity);
    return this;
  }

  setFromObject(obj: FakeObject3D): this {
    this.makeEmpty();
    obj.traverse(node => {
      const geometry = (node as { geometry?: { parameters?: unknown } }).geometry;
      const params = geometry?.parameters as { width?: number; height?: number; depth?: number } | undefined;
      if (!params) return;
      const width = Number(params.width) || 0;
      const height = Number(params.height) || 0;
      const depth = Number(params.depth) || 0;
      const corners = [
        new FakeVector3(-width / 2, -height / 2, -depth / 2),
        new FakeVector3(-width / 2, -height / 2, depth / 2),
        new FakeVector3(-width / 2, height / 2, -depth / 2),
        new FakeVector3(-width / 2, height / 2, depth / 2),
        new FakeVector3(width / 2, -height / 2, -depth / 2),
        new FakeVector3(width / 2, -height / 2, depth / 2),
        new FakeVector3(width / 2, height / 2, -depth / 2),
        new FakeVector3(width / 2, height / 2, depth / 2),
      ];
      for (const corner of corners) {
        node.localToWorld(corner);
        this.min.x = Math.min(this.min.x, corner.x);
        this.min.y = Math.min(this.min.y, corner.y);
        this.min.z = Math.min(this.min.z, corner.z);
        this.max.x = Math.max(this.max.x, corner.x);
        this.max.y = Math.max(this.max.y, corner.y);
        this.max.z = Math.max(this.max.z, corner.z);
      }
    });
    return this;
  }
}

export function createFakeThreeRuntime() {
  return {
    Box3: FakeBox3,
    BoxGeometry: FakeBoxGeometry,
    ExtrudeGeometry: FakeExtrudeGeometry,
    Group: FakeGroup,
    Mesh: FakeMesh,
    MeshBasicMaterial: FakeMeshBasicMaterial,
    Shape: FakeShape,
    Vector3: FakeVector3,
  };
}
