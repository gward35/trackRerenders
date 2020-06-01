import React from "react"

const InnerComponent = () => <div>Track Rerenders</div>

class ClassDemo extends React.Component {
  render() {
    return (
      <div>
        <InnerComponent />
      </div>
    )
  }
}

export default ClassDemo
