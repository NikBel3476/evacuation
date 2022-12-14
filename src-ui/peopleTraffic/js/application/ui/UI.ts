import { Mathem } from '../mathem/Mathem';
import { Building, BuildingElement, Point } from '../Interfaces/Building';
import { TimeData } from '../Interfaces/TimeData';

type UIConstructorParams = {
	data: {
		struct: Building;
		timerTimeDataUpdatePause: boolean;
		timerSpeedUp: number;
		timeData: TimeData;
		time: number;
		timeStep: number;

		gifFinish: boolean;
		isGifStop: boolean;
		passFrame: number;

		cameraXY: { x: number; y: number };
		canMove: boolean;
		scale: number;
		fieldWidth: number;
		fieldHeight: number;

		level: number;
		choiceBuild: BuildingElement | null;
		activeBuilds: BuildingElement[];

		activePeople: Array<{ uuid: string; XY: Array<Point> }>;
		peopleCoordinate: Array<{ uuid: string; XY: Array<Point> }>;
		maxNumPeople: number;
		peopleDen: number;
		peopleR: number;
		label: number;
		exitedLabel: number;
	};
	mathem: Mathem;
};

export class UI {
	private data: UIConstructorParams['data'];
	private struct: Building;
	private mathem: Mathem;
	private levelHTML: HTMLElement;
	private buildingTypeHTML: HTMLElement;
	private buildingIdHTML: HTMLElement;
	private totalNumberOfPeopleHTML: HTMLElement;
	private buildingNameHTML: HTMLElement;
	private areaHTML: HTMLElement;
	private movingTimeHTML: HTMLElement;
	private numberOfPeopleInsideHTML: HTMLElement;
	private numberOfPeopleOutsideHTML: HTMLElement;
	private pauseButton: HTMLElement;
	private playButton: HTMLElement;

	constructor({ data, mathem }: UIConstructorParams) {
		this.data = data;
		this.struct = this.data.struct;
		this.mathem = mathem;

		this.levelHTML = document.getElementById('level')!;
		this.buildingTypeHTML = document.getElementById('sign')!;
		this.buildingIdHTML = document.getElementById('id')!;
		this.totalNumberOfPeopleHTML = document.getElementById('numPeople')!;
		this.buildingNameHTML = document.getElementById('name')!;
		this.areaHTML = document.getElementById('area')!;
		this.movingTimeHTML = document.getElementById('movingTime')!;
		this.numberOfPeopleInsideHTML = document.getElementById('personCount')!;
		this.numberOfPeopleOutsideHTML = document.getElementById('personExited')!;
		this.pauseButton = document.getElementById('pause')!;
		this.playButton = document.getElementById('play')!;

		this.init();
	}

	updateUI() {
		if (this.data.choiceBuild) {
			this.levelHTML.textContent =
				'?????????????? ?????????? (??????????): ' + this.struct.Level[this.data.level].ZLevel;
			this.buildingTypeHTML.textContent = '??????: ' + this.data.choiceBuild.Sign;
			this.buildingIdHTML.textContent = 'ID: ' + this.data.choiceBuild.Id;
			this.totalNumberOfPeopleHTML.textContent =
				'???????????????????? ??????????: ' + this.getPeopleCountInChoiceRoom();
			this.buildingNameHTML.textContent = '????????????????: ' + this.data.choiceBuild.Name;
			this.areaHTML.textContent =
				'??????????????: ' +
				Math.floor(this.mathem.calculateBuildArea(this.data.choiceBuild)) +
				' ??^2';
		}

		this.movingTimeHTML.textContent = '???????????????????????? ????????????????, ??????: ' + this.data.time;
		this.numberOfPeopleInsideHTML.textContent =
			'???????????????????? ?????????? ?? ????????????, ??????: ' + this.data.label;
		this.numberOfPeopleOutsideHTML.textContent = '?????????????? ??????????: ' + this.data.exitedLabel;
	}

	getPeopleCountInChoiceRoom(): number {
		const coordinates = this.data.peopleCoordinate.find(
			coordinate => this.data.choiceBuild?.Id === coordinate.uuid
		);

		return coordinates?.XY.length ?? 0;
	}

	init() {
		this.levelHTML.textContent = '?????????????? ??????????: ';
		this.buildingTypeHTML.textContent = '??????: ';
		this.buildingIdHTML.textContent = 'ID: ';
		this.totalNumberOfPeopleHTML.textContent = '???????????????????? ??????????:';
		this.buildingNameHTML.textContent = '????????????????: ';
		this.areaHTML.textContent = '??????????????: ';
		this.numberOfPeopleInsideHTML.textContent =
			'???????????????????? ?????????? ?? ????????????, ??????: ' + this.data.label;
		this.movingTimeHTML.textContent = '???????????????????????? ????????????????, ??????: ' + this.data.time;

		this.pauseButton.addEventListener('click', _ => {
			if (!this.data.timerTimeDataUpdatePause) {
				this.data.timerTimeDataUpdatePause = true;
				this.data.isGifStop = true;
			}
		});
		this.playButton.addEventListener('click', _ => {
			if (this.data.timerTimeDataUpdatePause) {
				this.data.timerTimeDataUpdatePause = false;
			}
		});
	}
}
