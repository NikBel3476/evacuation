use fnv::FnvHashMap;
use petgraph::Undirected;
use std::hash::Hash;

struct Graph<VId, E = (), V = ()> {
	vertices: FnvHashMap<VId, V>,
	adjacency: FnvHashMap<VId, Vec<(VId, E)>>,
}

impl<VId, E, V> Graph<VId, E, V>
where
	VId: Eq + Hash,
	V: Hash,
{
	fn new() -> Graph<VId, E, V> {
		Graph {
			vertices: FnvHashMap::default(),
			adjacency: FnvHashMap::default(),
		}
	}

	fn push_vertex(self: &mut Graph<VId, E, V>, vid: VId, vertex: V) {
		self.vertices.insert(vid, vertex);
	}

	fn push_edge(self: &mut Self, from: VId, to: VId, edge: E) {
		let adjacent_to_from = self.adjacency.entry(from).or_default();
		adjacent_to_from.push((to, edge));
	}
}

impl<VId, E> Graph<VId, E, ()>
where
	VId: Eq + Hash,
{
	fn push_vid(self: &mut Self, vid: VId) {
		self.vertices.insert(vid, ());
	}
}

impl<VId, E, V> Graph<VId, E, V>
where
	VId: Eq + Hash + Clone,
	V: Hash,
	E: Clone,
{
	fn push_undirected_edge(self: &mut Self, from: VId, to: VId, edge: E) {
		self.push_edge(from.clone(), to.clone(), edge.clone());
		self.push_edge(to, from, edge);
	}
}

pub struct node {
	dest: u64,
	edge_id: u64,
}

pub struct edge {
	src: u64,
	dest: u64,
}

pub fn graph_new() -> petgraph::Graph<node, edge, Undirected> {
	petgraph::Graph::new_undirected()
}
