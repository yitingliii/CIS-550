import React from 'react';

import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import HomePage from './pages/HomePage'; 
import SearchPage from "./pages/SearchPage";
import GenrePage from "./pages/GenrePage"
import Collaboration from "./pages/Collaboration"
import SoundPage from "./pages/SoundPage"

export default function App() {

	return (
		<div className="App">
			<Router>
				<Switch>
					<Route exact
						path="/"
						render={() => (
							<HomePage />
						)} />
						<Route path="/search" component={SearchPage} />
					<Route exact
						path="/"
						render={() => (
							<HomePage />
						)} />
						<Route path="/genre" component={GenrePage} />

					<Route exact
						path="/"
						render={() => (
							<HomePage />
						)} />
						<Route path="/collaboration" component={Collaboration} />

					<Route exact
						path="/"
						render={() => (
							<HomePage />
						)} />
						<Route path="/sound" component={SoundPage} />
					{/* <Route exact
						path="/dashboard"
						render={() => (
							<Dashboard />
						)} />

					<Route
						path="/FindFriends"
						render={() => (
							<FindFriends />
						)} /> */}
				</Switch>
			</Router>
		</div>
	);

}