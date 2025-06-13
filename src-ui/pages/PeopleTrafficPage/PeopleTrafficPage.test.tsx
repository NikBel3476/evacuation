import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '../../tests/helpers/renderWithProviders';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import PeopleTrafficPage from './PeopleTrafficPage';
import { renderWithRouter } from '../../tests/helpers/renderWithRouter';
import { mockIPC } from '@tauri-apps/api/mocks';
import { DirEntry } from '@tauri-apps/plugin-fs';

// describe('ModelingViewPage tests', () => {
// 	test('Should be rendered without errors', () => {
// 		mockIPC(cmd => {
// 			const files: Array<DirEntry & { path: string }> = [
// 				{
// 					path: 'resources/building.json',
// 					name: 'building.json',
// 					isDirectory: false,
// 					isFile: true,
// 					isSymlink: false
// 				},
// 				{
// 					path: 'res/test.json',
// 					name: 'test.json',
// 					isDirectory: false,
// 					isFile: true,
// 					isSymlink: false
// 				},
// 				{
// 					path: 'two_levels.json',
// 					name: 'two_levels.json',
// 					isDirectory: false,
// 					isFile: true,
// 					isSymlink: false
// 				}
// 			];
// 			if (cmd === 'readDir') {
// 				return files;
// 			}
// 		});

// 		renderWithProviders(
// 			<BrowserRouter>
// 				<PeopleTrafficPage />
// 			</BrowserRouter>
// 		);

// 		expect(screen.getByText(/Main page/)).toBeInTheDocument();
// 	});
// });
