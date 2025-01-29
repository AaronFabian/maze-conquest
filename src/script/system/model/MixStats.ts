import { MixStatsDef } from '@/script/interface/system/MixStatsDef';

export class MixStats {
	uid: string;
	power: number;
	ownerUsername: string;
	photoUrl: string;
	constructor(def: MixStatsDef) {
		this.uid = def.uid;
		this.power = def.power;
		this.ownerUsername = def.ownerUsername;
		this.photoUrl = def.photoUrl;
	}

	toPlainObject(): MixStatsDef {
		return { uid: this.uid, power: this.power, ownerUsername: this.ownerUsername, photoUrl: this.photoUrl };
	}
}
