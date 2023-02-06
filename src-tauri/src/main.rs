#![cfg_attr(
	all(not(debug_assertions), target_os = "windows"),
	windows_subsystem = "windows"
)]

use tauri::{AppHandle, WindowBuilder};

use bim_cli;
use bim_configure;
use bim_evac;
use bim_graph;
use bim_json_object;
use bim_output;
use bim_polygon_tools;
use bim_tools;
use cli;
use configuration;
use json_object;
use run::run_rust;

mod run_bindings;

fn main() {
	tauri::Builder::default()
		.invoke_handler(tauri::generate_handler![
			read_config,
			open_configuration_window,
			open_configuration_rescript_window,
			open_people_traffic_window,
			open_building_view_window,
			bim_start
		])
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}

#[tauri::command]
fn read_config() -> Result<configuration::ScenarioCfg, String> {
	configuration::load_cfg("../scenario.json")
}

#[tauri::command]
async fn open_configuration_window(handle: AppHandle) {
	let _configuration_window = WindowBuilder::new(
		&handle,
		"configuration",
		tauri::WindowUrl::App("src-ui/config/index.html".into()),
	)
	.title("Configuration")
	.build()
	.unwrap();
}

#[tauri::command]
async fn open_configuration_rescript_window(handle: AppHandle) {
	let _configuration_window = WindowBuilder::new(
		&handle,
		"configurationRescript",
		tauri::WindowUrl::App("src-ui/configRescript/index.html".into()),
	)
	.title("Configuration rescript")
	.build()
	.unwrap();
}

#[tauri::command]
async fn open_people_traffic_window(handle: AppHandle) {
	let _people_traffic_window = WindowBuilder::new(
		&handle,
		"people_traffic",
		tauri::WindowUrl::App("src-ui/peopleTraffic/index.html".into()),
	)
	.title("People traffic")
	.min_inner_size(1000.0, 800.0)
	.build()
	.unwrap();
}

#[tauri::command]
async fn open_building_view_window(handle: AppHandle) {
	let _building_view_window = WindowBuilder::new(
		&handle,
		"building_view",
		tauri::WindowUrl::App("src-ui/buildingView/index.html".into()),
	)
	.title("Building view")
	.min_inner_size(1000.0, 800.0)
	.build()
	.unwrap();
}

#[tauri::command]
async fn bim_start() {
	unsafe { run_bindings::run() };
	run_rust();
}
