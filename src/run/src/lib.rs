use bim_evac::{
	evac_def_modeling_step, evac_moving_step_test_with_log, evac_set_density_max_rust,
	evac_set_density_min_rust, evac_set_modeling_step_rust, evac_set_speed_max_rust, get_time_m,
	get_time_s, set_density_max, set_density_min, set_modeling_step, set_speed_max, time_inc,
	time_reset,
};
use bim_graph::bim_graph_new_test;
use bim_json_object::{bim_json_object_new, BimElementSign};
use bim_output::{
	bim_basename_rust, bim_create_file_name_rust, bim_output_body, bim_output_head,
	OUTPUT_DETAIL_FILE_RUST, OUTPUT_SHORT_FILE_RUST, OUTPUT_SUFFIX,
};
use bim_tools::{bim_t_rust, bim_tools_get_num_of_people, bim_tools_new_rust, set_people_to_zone};
use cli::CliParameters;
use configuration::{load_cfg, DistributionType, ScenarioCfg, TransitionType};
use std::io::Write;

pub fn run_rust() {
	let cli_parameters = CliParameters {
		scenario_file: String::from("../scenario.json"),
	};

	let scenario_configuration = load_cfg(&cli_parameters.scenario_file)
		.unwrap_or_else(|e| panic!("Error reading the scenario configuration file. Error: {e}"));

	// TODO: add the logger

	for file in &scenario_configuration.files {
		let filename = bim_basename_rust(file);
		println!("The file name of the used bim `{filename}.json`");

		// Чтение файла и разворачивание его в структуру
		let bim_json = bim_json_object_new(file);

		let mut bim = bim_tools_new_rust(&bim_json);

		applying_scenario_bim_params(&mut bim, &scenario_configuration);

		// Files with results
		let output_detail =
			bim_create_file_name_rust(&filename, OUTPUT_DETAIL_FILE_RUST, OUTPUT_SUFFIX);
		let output_short =
			bim_create_file_name_rust(&filename, OUTPUT_SHORT_FILE_RUST, OUTPUT_SUFFIX);

		let mut fp_detail =
			std::fs::File::create(&output_detail).expect("Error opening the output file");
		let mut fp_short =
			std::fs::File::create(&output_short).expect("Error opening the output file");

		bim_output_head(&bim, &mut fp_detail);
		bim_output_body(&bim, 0.0, &mut fp_detail);

		// let graph = bim_graph_new_rust(&bim);
		let graph = bim_graph_new_test(&bim);
		// TODO: add print graph

		evac_def_modeling_step(&bim);
		time_reset();

		let remainder = 0.0; // Количество человек, которое может остаться в зд. для остановки цикла
		loop {
			evac_moving_step_test_with_log(graph, &mut bim.zones, &mut bim.transits);
			time_inc();
			bim_output_body(&bim, get_time_m(), &mut fp_detail);

			let mut num_of_people = 0.0;
			for zone in &bim.zones {
				if zone.is_visited {
					num_of_people += zone.number_of_people;
				}
			}

			if num_of_people <= remainder {
				break;
			}
		}

		let num_of_evacuated_people = bim_tools_get_num_of_people(&bim);
		let evacuation_time_m = get_time_m();
		let evacuated_people = bim.zones[bim.zones.len() - 1].number_of_people;

		println!(
			"Длительность эвакуации: {:.2} с. ({:.2} мин.)",
			get_time_s(),
			evacuation_time_m
		);
		println!(
			"Количество человек: в здании - {num_of_evacuated_people:.2} (в безопасной зоне - {evacuated_people:.2}) чел."
		);
		println!("{}", bim.zones[bim.zones.len() - 1].name);
		println!("---------------------------------------");

		fp_short
			.write_all(
				format!(
					"{evacuation_time_m:.2},{num_of_evacuated_people:.2},{evacuated_people:.2}"
				)
				.as_bytes(),
			)
			.unwrap_or_else(|e| panic!("Failed to write fp_short to file. Error: {e}"));
	}
}

pub fn applying_scenario_bim_params(bim: &mut bim_t_rust, scenario_configuration: &ScenarioCfg) {
	for transition in &mut bim.transits {
		if scenario_configuration.transition.transitions_type == TransitionType::Users {
			match transition.sign {
				BimElementSign::DOOR_WAY_IN => {
					transition.width = f64::from(scenario_configuration.transition.doorway_in)
				}
				BimElementSign::DOOR_WAY_OUT => {
					transition.width = f64::from(scenario_configuration.transition.doorway_out)
				}
				_ => {}
			}
		}

		// A special set up the transit width of item of bim
		for special in &scenario_configuration.transition.special {
			for uuid in &special.uuid {
				if transition.uuid.eq(uuid) {
					transition.width = f64::from(special.width);
				}
			}
		}
	}

	// in c code bim->transits is a pointers to bim->levels[_]->transits so necessary to update bim->levels[_]->transits
	for level in &mut bim.levels {
		for transition in &mut level.transits {
			if scenario_configuration.transition.transitions_type == TransitionType::Users {
				match transition.sign {
					BimElementSign::DOOR_WAY_IN => {
						transition.width = f64::from(scenario_configuration.transition.doorway_in)
					}
					BimElementSign::DOOR_WAY_OUT => {
						transition.width = f64::from(scenario_configuration.transition.doorway_out)
					}
					_ => {}
				}
			}

			// A special set up the transit width of item of bim
			for special in &scenario_configuration.transition.special {
				for uuid in &special.uuid {
					if transition.uuid.eq(uuid) {
						transition.width = f64::from(special.width);
					}
				}
			}
		}
	}

	for zone in &mut bim.zones {
		if zone.sign == BimElementSign::OUTSIDE {
			continue;
		}

		if scenario_configuration.distribution.distribution_type == DistributionType::Uniform {
			set_people_to_zone(
				zone,
				(zone.area * f64::from(scenario_configuration.distribution.density)) as f32,
			);
		}

		// A special set up the density of item of bim
		for special in &scenario_configuration.distribution.special {
			for uuid in &special.uuid {
				if zone.uuid.eq(uuid) {
					set_people_to_zone(zone, (zone.area * f64::from(special.density)) as f32);
				}
			}
		}
	}

	// in c code bim->zones is a pointers to bim->levels[_]->zones so necessary to update bim->levels[_]->zones
	for level in &mut bim.levels {
		for zone in &mut level.zones {
			if zone.sign == BimElementSign::OUTSIDE {
				continue;
			}

			if scenario_configuration.distribution.distribution_type == DistributionType::Uniform {
				set_people_to_zone(
					zone,
					(zone.area * f64::from(scenario_configuration.distribution.density)) as f32,
				);
			}

			// A special set up the density of item of bim
			for special in &scenario_configuration.distribution.special {
				for uuid in &special.uuid {
					if zone.uuid.eq(uuid) {
						set_people_to_zone(zone, (zone.area * f64::from(special.density)) as f32);
					}
				}
			}
		}
	}

	set_modeling_step(f64::from(scenario_configuration.modeling.step));
	evac_set_modeling_step_rust(f64::from(scenario_configuration.modeling.step));
	set_speed_max(f64::from(scenario_configuration.modeling.max_speed));
	evac_set_speed_max_rust(f64::from(scenario_configuration.modeling.max_speed));
	set_density_max(f64::from(scenario_configuration.modeling.max_density));
	evac_set_density_max_rust(f64::from(scenario_configuration.modeling.max_density));
	set_density_min(f64::from(scenario_configuration.modeling.min_density));
	evac_set_density_min_rust(f64::from(scenario_configuration.modeling.min_density));
}

// fn applying_scenario_bim_params_rust(bim: &mut bim_t_rust, cfg_scenario: &ScenarioCfg) {
// 	for i in 0..bim.transits.len() {
// 		if cfg_scenario.transition.transitions_type == TransitionType::Users {
// 			if bim.transits[i].sign == BimElementSign::DOOR_WAY_IN {
// 				bim.transits[i].width = cfg_scenario.transition.doorway_in;
// 			}
// 			if bim.transits[i].sign == BimElementSign::DOOR_WAY_OUT {
// 				bim.transits[i].width = cfg_scenario.transition.doorway_out;
// 			}
// 		}
//
// 		// A special set up the transit width of item of bim
// 		for s in 0..cfg_scenario.transition.special.len() {
// 			let special = &cfg_scenario.transition.special[s];
// 			for u in 0..special.uuid.len() {
// 				if bim.transits[i].uuid.eq(&special.uuid[u]) {
// 					bim.transits[i].width = special.width;
// 				}
// 			}
// 		}
// 	}
//
// 	for i in 0..bim.zones.len() {
// 		if bim.zones[i].sign == BimElementSign::OUTSIDE {
// 			continue;
// 		}
//
// 		if cfg_scenario.distribution.distribution_type == DistributionType::Uniform {
// 			bim.zones[i].number_of_people = bim.zones[i].area * cfg_scenario.distribution.density;
// 		}
//
// 		// A special set up the density of item of bim
// 		for s in 0..cfg_scenario.distribution.special.len() {
// 			let special = &cfg_scenario.distribution.special[s];
// 			for u in 0..special.uuid.len() {
// 				if bim.zones[i].uuid.eq(&special.uuid[u]) {
// 					bim.zones[i].number_of_people = bim.zones[i].area * special.density;
// 				}
// 			}
// 		}
// 	}
//
// 	set_modeling_step(cfg_scenario.modeling.step);
// 	evac_set_modeling_step_rust(cfg_scenario.modeling.step);
// 	set_speed_max(cfg_scenario.modeling.max_speed);
// 	evac_set_speed_max_rust(cfg_scenario.modeling.max_speed);
// 	set_density_max(cfg_scenario.modeling.max_density);
// 	evac_set_density_max_rust(cfg_scenario.modeling.max_density);
// 	set_density_min(cfg_scenario.modeling.min_density);
// 	evac_set_density_min_rust(cfg_scenario.modeling.min_density);
// }
