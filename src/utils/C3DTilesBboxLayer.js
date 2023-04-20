import * as itowns from 'itowns';
import * as three from 'three';
import { OBBHelper } from './OBBHelper';


const bboxMesh = new three.Mesh();


export class C3DTilesBboxLayer extends itowns.GeometryLayer {
    constructor(c3DTilesLayer) {
        super(`${c3DTilesLayer.id}-obb`, new three.Object3D(), {
            cacheLifeTime: Infinity,
            source: false,
            visible: false,
        });
    }

    update(context, layer, node) {
        const metadata = node.userData.metadata;

        let helper = node.userData.obb;

        if (!layer.visible) {
            if (helper) {
                helper.visible = false;
                if (typeof helper.setMaterialVisibility === 'function') {
                    helper.setMaterialVisibility(false);
                }
            }
            return;
        }

        if (node.visible && metadata.boundingVolume) {
            if (!helper) {
                if (metadata.boundingVolume.region) {
                    helper = new OBBHelper(metadata.boundingVolume.region);
                    context.view.scene.add(helper);
                    helper.updateMatrixWorld(true);
                } else if (metadata.boundingVolume.box) {
                    bboxMesh.geometry.boundingBox = metadata.boundingVolume.box;
                    helper = new three.BoxHelper(bboxMesh);
                    helper.material.linewidth = 2;
                } else if (metadata.boundingVolume.sphere) {
                    helper = new three.Mesh(
                        new three.SphereGeometry(
                            metadata.boundingVolume.sphere.radius, 32, 32,
                        ),
                        new three.MeshBasicMaterial({ wireframe: true }),
                    );
                    helper.position.copy(metadata.boundingVolume.sphere.center);
                } else {
                    return;
                }

                node.userData.obb = helper;
                helper.updateMatrixWorld();

                if (!metadata.boundingVolume.region) {
                    // compensate b3dm orientation correction
                    const gltfUpAxis = layer.parent.tileset.asset.gltfUpAxis;
                    if (gltfUpAxis === undefined || gltfUpAxis === 'Y') {
                        helper.rotation.x = -Math.PI * 0.5;
                    } else if (gltfUpAxis === 'X') {
                        helper.rotation.z = -Math.PI * 0.5;
                    }

                    // Add helper to parent to apply the correct transformation
                    node.parent.add(helper);
                    helper.updateMatrix();
                    helper.updateMatrixWorld(true);
                }
            }

            if (helper) {
                helper.visible = true;
                if (typeof helper.setMaterialVisibility === 'function') {
                    helper.setMaterialVisibility(true);
                }
            }
        } else if (helper) {
            helper.visible = false;
            if (typeof helper.setMaterialVisibility === 'function') {
                helper.setMaterialVisibility(false);
            }
        }
    }
}

