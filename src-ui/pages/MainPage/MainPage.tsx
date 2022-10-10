import { invoke } from '@tauri-apps/api/tauri';
import { FC } from 'react';
import { Link } from 'react-router-dom';

type mainPageProps = {};

const MainPage: FC<mainPageProps> = () => {
	const handleOpenConfigurationButtonClick = () => {
		invoke('open_configuration_window');
	};

	const handleOpenPeopleTrafficButtonClick = () => {
		invoke('open_people_traffic_window');
	};

	return (
		<main>
			<h1>Main page</h1>
			<Link to="configuration">Configuration page</Link>
			<div>
				<button onClick={handleOpenConfigurationButtonClick}>Открыть окно настроек</button>
			</div>
			<div>
				<button onClick={handleOpenPeopleTrafficButtonClick}>
					Открыть окно моделирования эвакуации
				</button>
			</div>
		</main>
	);
};

export default MainPage;
