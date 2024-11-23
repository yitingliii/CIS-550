import React from 'react';

import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import HomePage from './pages/HomePage'; 
import SearchPage from "./pages/SearchPage";

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