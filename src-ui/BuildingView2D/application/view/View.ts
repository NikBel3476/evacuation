import { Canvas } from '../canvas/Canvas';
import { Mathem } from '../mathem/Mathem';
import { BuildingElement, Point } from '../Interfaces/Building';
import { Graphics as PixiGraphics } from '@pixi/graphics';

interface ViewConstructorParams {
	canvas: Canvas;
	data: {
		cameraXY: Point;
		scale: number;

		activeBuilds: BuildingElement[];
	};
	mathem: Mathem;
}

export class View {
	canvas: Canvas;
	data: ViewConstructorParams['data'];
	mathem: Mathem;
	activePeople: Array<{ uuid: string; XY: Point[] }> = [];
	private readonly peopleR: number = 0.25;

	constructor({ canvas, data, mathem }: ViewConstructorParams) {
		this.canvas = canvas;
		this.data = data;
		this.mathem = mathem;
	}

	// Отрисовка "коробочек" элементов
	drawBox(coordinates: Point[]) {
		this.canvas.moveTo(
			coordinates[0].x * this.data.scale - this.data.cameraXY.x,
			coordinates[0].y * this.data.scale - this.data.cameraXY.y
		);
		coordinates
			.slice(1)
			.forEach(point =>
				this.canvas.line_(
					point.x * this.data.scale - this.data.cameraXY.x,
					point.y * this.data.scale - this.data.cameraXY.y
				)
			);
	}

	// Отрисовка комнаты
	drawBuild(build: BuildingElement) {
		this.canvas.beginPath();
		this.drawBox(build.XY[0].points);
		const RGB = 'rgb(255,255,255)';
		this.canvas.fill(RGB);
		this.canvas.closePath();
	}

	static drawBuildingRoomPixi(g: PixiGraphics, points: Point[]) {
		g.moveTo(points[0].x, points[0].y);
		g.beginFill(0xffffff);
		g.lineStyle(0.1, 0x000000, 1);
		points.slice(1).forEach(point => {
			g.lineTo(point.x, point.y);
		});
		g.endFill();
	}

	static drawBuildingRoomsPixi(g: PixiGraphics, buildings: BuildingElement[]) {
		buildings.forEach(building => {
			View.drawBuildingRoomPixi(g, building.XY[0].points);
		});
	}

	drawPeople(people: { uuid: string; XY: Point[] }, buildings: BuildingElement[]) {
		this.canvas.beginPath();
		const building = buildings.find(building => building.Id === people.uuid);
		if (building) {
			people.XY.forEach(point =>
				this.canvas.circle(
					point.x * this.data.scale - this.data.cameraXY.x,
					point.y * this.data.scale - this.data.cameraXY.y,
					this.peopleR * this.data.scale,
					'red'
				)
			);
		}
		this.canvas.closePath();
	}

	static drawPeople(g: PixiGraphics, peopleCoordinates: Point[]): void {
		g.beginFill(0xff0000);
		g.lineStyle(0.05, 0x000000, 1);
		peopleCoordinates.forEach(coordinates =>
			g.drawCircle(coordinates.x, coordinates.y, 0.5)
		);
		g.endFill();
	}

	// Отрисовка всего
	render() {
		this.canvas.clear();
		this.data.activeBuilds.forEach(build => this.drawBuild(build));
		this.activePeople.forEach(people => this.drawPeople(people, this.data.activeBuilds));
		this.canvas.print();
	}
}
