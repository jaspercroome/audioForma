import React, { Component } from "react";
import { spotifyToken, spotifyTracks} from "../actions";
// import rainbowScale from "./rainbowScale";
import { interpolateRainbow } from "d3-scale-chromatic";
import { scaleSequential, scaleOrdinal, scaleLinear } from "d3-scale";
import { forceSimulation, forceCollide, forceY, forceX } from "d3-force";

// import { select } from "d3-selection";
import { Group } from "@vx/group";
import { Circle } from "@vx/shape";

class Bubble extends Component {

  constructor(props) {
    super(props);
    const token = window.location.hash.split("=", 2)[1].split("&", 1)[0]
    const width = window.innerWidth * 0.75
    const height = window.innerHeight * 0.9

    this.state = {
      d3Status: 'Not Started',
      width: width,
      height: height,
      token: token,
      tracks: {}
    };
  }
  
  componentDidMount() {

    const getTracks = token => {
      spotifyTracks.getTracks(this.state.token).then(tracks => {
        this.setState({ tracks: tracks })
        this.setState({d3Status: 'pending'})
      })
    }
  getTracks()
  }

  componentDidUpdate() {
    if (this.state.d3Status === 'pending'){
    const data = this.state.tracks
    const xScale = scaleLinear([0, 1],[0, this.state.width])
    const yScale = scaleLinear([0, 1],[this.state.height, 0])
    const move = forceSimulation()
    .force(
      "x",
      forceX(d => {
        return xScale(d["valence"]);
      }).strength(0.1)
      )
    .force(
        "y",
        forceY(d => {
          return yScale(0.5);
        }).strength(0.1)
        )
    .force(
          "collide",
          forceCollide(d => {
            return 10;
          }).iterations(5)
          );
    move.nodes(data)
    .on("tick",(tracks)=>{
            this.setState({d3Data: tracks})
          })
    this.setState({d3Status:'Completed'})
        }
  }


  render() {
    const width = window.innerWidth * 0.75;
    const height = window.innerHeight * 0.9;

    const d3Data = Array.from(this.state.tracks);

    //Color Scale
    var lookup = {};
    var artistArray = [];

    for (var item, i = 0; (item = d3Data[i++]); ) {
      var name = item["artists"][0]["name"];

      if (!(name in lookup)) {
        lookup[name] = 1;
        artistArray.push(name);
      }
    }
    var artistIndexArray = [];
    // map the artist index to a matching array, for the range in the color scale.
    for (i = 0; i < artistArray.length; i++) {
      artistIndexArray.push(i / artistArray.length);
    }
    const color = scaleSequential(interpolateRainbow);

    const artistScale = scaleOrdinal()
      .domain(artistArray)
      .range(artistIndexArray);
    //


    return (
      <div>
        <svg width={width} height={height}>
          <Group>
            if (this.state.d3Status !== 'Completed')
            {
              d3Data.map((track, i) => {
                const cx = track["x"];
                const cy = track["y"];
                const r = (1 / 100) * width; // equivalent of .5vw
                const fill = color(artistScale(track["artists"][0]["name"]));
                return (
                  <Circle
                    key={`point-${track["id"]}-${track["name"]}`}
                    className="dot"
                    cx={cx}
                    cy={cy}
                    r={r}
                  fill={fill}
                  />
                );
              })}
          </Group>
        </svg>
      </div>
    );
  }
}
export default Bubble;
