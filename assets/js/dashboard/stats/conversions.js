import React from 'react';
import { Link } from 'react-router-dom'

import Bar from './bar'
import MoreLink from './more-link'
import numberFormatter from '../number-formatter'
import * as api from '../api'

export default class Conversions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {loading: true}
  }

  componentDidMount() {
    this.fetchConversions()
  }

  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      this.setState({loading: true, goals: null})
      this.fetchConversions()
    }
  }

  fetchConversions() {
    api.get(`/api/stats/${encodeURIComponent(this.props.site.domain)}/conversions`, this.props.query)
      .then((res) => this.setState({loading: false, goals: res}))
  }

  renderGoalText(goalName) {
    if (this.props.query.period === 'realtime') {
      return <span className="block px-2" style={{marginTop: '-26px'}}>{goalName}</span>
    } else {
      const query = new URLSearchParams(window.location.search)
      query.set('goal', goalName)

      return (
        <Link to={{search: query.toString(), state: {scrollTop: true}}} style={{marginTop: '-26px'}} className="hover:underline block px-2">
          { goalName }
        </Link>
      )
    }
  }

  renderGoal(goal) {
    return (
      <div className="flex items-center justify-between my-2 text-sm" key={goal.name}>
        <div className="w-full h-8" style={{maxWidth: 'calc(100% - 6rem)'}}>
          <Bar count={goal.count} all={this.state.goals} bg="bg-red-50" />
          {this.renderGoalText(goal.name)}
        </div>
        <span className="font-medium">{numberFormatter(goal.count)}</span>
      </div>
    )
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="w-full bg-white shadow-xl rounded p-4" style={{height: '94px'}}>
          <div className="loading my-2 mx-auto"><div></div></div>
        </div>
      )
    } else if (this.state.goals) {
      return (
        <div className="w-full bg-white shadow-xl rounded p-4">
          <h3 className="font-bold">{this.props.title || "Goal Conversions"}</h3>
          <div className="flex items-center mt-3 mb-2 justify-between text-gray-500 text-xs font-bold tracking-wide">
            <span>Goal</span>
            <span>Conversions</span>
          </div>

          { this.state.goals.map(this.renderGoal.bind(this)) }
        </div>
      )
    }
  }
}
