import * as THREE from 'three';


export class OBBHelper extends THREE.Box3Helper {
    constructor(OBB) {

        super(
            OBB.box3D,
            new THREE.Color(
                Math.random(), Math.random(), Math.random()
            ).getHex(),
        );

        this.obb = OBB;
        this.material.linewidth = 2;

        this.frustumCulled = false;
        this.matrixAutoUpdate = false;
        this.rotationAutoUpdate = false;

        this.updateMatrixWorld(true);
    }

    updateMatrixWorld(force = false) {
        if (this.obb.box3D.isEmpty()) {
            return;
        }

        this.quaternion.copy(this.obb.quaternion);

        this.obb.box3D
            .getCenter(this.position)
            .applyQuaternion(this.quaternion)
            .add(this.obb.position);

        this.obb.box3D.getSize(this.scale);

        this.scale.multiplyScalar(0.5);

        this.updateMatrix();

        THREE.Object3D.prototype.updateMatrixWorld.call(this, force);
    }
}

