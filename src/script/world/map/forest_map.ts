import { AABB } from '@/script/interface/game/AABB';

export const FOREST_MAP = {
	treeCollision: <AABB[]>[
		{
			height: 16,
			width: 16,
			x: 256,
			y: 107,
		},
		{
			height: 16,
			width: 16,
			x: 288,
			y: 235,
		},
		{
			height: 16,
			width: 16,
			x: 0,
			y: 139,
		},
		{
			height: 16,
			width: 16,
			x: 32,
			y: 59,
		},
		{
			height: 16,
			width: 16,
			x: 128,
			y: -5,
		},
	],
	waterCollision: <AABB[]>[
		{
			height: 16,
			width: 48,
			x: 64,
			y: 96,
		},
		{
			height: 32,
			width: 16,
			x: 96,
			y: 64,
		},
		{
			height: 16,
			width: 64,
			x: 112,
			y: 64,
		},
		{
			height: 48,
			width: 16,
			x: 176,
			y: 32,
		},
		{
			height: 96,
			width: 16,
			x: 192,
			y: 32,
		},
		{
			height: 16,
			width: 64,
			x: 144,
			y: 128,
		},
		{
			height: 16,
			width: 96,
			x: 64,
			y: 144,
		},
		{
			height: 32,
			width: 16,
			x: 64,
			y: 112,
		},
	],
};
