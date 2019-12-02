import React, {Component, PureComponent} from 'react';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data:{
        PATIENT:{},
        PERSONNEL:{},
        BED:{},
        PATIENT_BED_ASSIGNMENT:{},
        PERSONNEL_BED_ASSIGNMENT:{},
      },
      day: 0
    };
    this.updateDay = this.updateDay.bind(this);
    this.updateData = this.updateData.bind(this);
  }
  
  render() {
    let {data,day} = this.state;
    return (
      <>
        <div>
          Day: {day}
        </div>
        <div>
          <input  type='range' min='0' max='99' value={day}
                  onChange={this.updateDay}
          />
        </div>
        <div>
          <p>Patient:</p>
          <PatientStorage patientCollection={data.PATIENT}/>
        </div>
        <div>
          <p>Personnel:</p>
          <PersonnelStorage personnelCollection={data.PERSONNEL}/>
        </div>
        <div>
          <p>Bed:</p>
          <BedStorage bedCollection={data.BED}/>
        </div>
        <div>
          <p>PatientBedAssignment:</p>
          <PatientBedAssignmentStorage patientBedAssignmentCollection={data.PATIENT_BED_ASSIGNMENT}/>
        </div>
        <div>
          <p>PersonnelBedAssignment:</p>
          <PersonnelBedAssignmentStorage personnelBedAssignmentCollection={data.PERSONNEL_BED_ASSIGNMENT}/>
        </div>
        <Downloader day={day} updateDataHandler={this.updateData} />
      </>
    );
  }
  
  componentDidMount(){
    
  }
  
  componentDidUpdate(){
    
  }
  
  updateDay(ev) {
    let day = Number.parseInt(ev.target.value);
    this.setState({day});
  }
  
  updateData(data){
    this.setState({data});
  }
}

class Table extends PureComponent{
  render(){
    let {columns,data} = this.props;
    return JSON.stringify(data);
  }
}

class PatientStorage extends PureComponent{
  render(){
    let {patientCollection} = this.props;
    return (
      <svg width='300' height="20" viewBox="0 0 15 1" xmlns="http://www.w3.org/2000/svg">
        {[...new Array(15).keys()].map( (i)=> {
          if (i.toString() in patientCollection) {
            return <rect key={i} x={i} y='0' width="1" height="1" fill="red" strokeWidth="0.2" stroke="white" />;
          } else {
            return <rect key={i} x={i} y='0' width="1" height="1" fill="lightgrey" strokeWidth="0.2" stroke="white" />;
          }
        })}
      </svg>
    );
  }
}

class PersonnelStorage extends PureComponent{
  render(){
    let {personnelCollection} = this.props;
    return (
      <svg width='100' height="20" viewBox="0 0 5 1" xmlns="http://www.w3.org/2000/svg">
        {[...new Array(5).keys()].map( (i)=> {
          if ((i+15).toString() in personnelCollection) {
            return <rect key={i} x={i} y='0' width="1" height="1" fill="red" strokeWidth="0.2" stroke="white" />;
          } else {
            return <rect key={i} x={i} y='0' width="1" height="1" fill="lightgrey" strokeWidth="0.2" stroke="white" />;
          }
        })}
      </svg>
    );
  }
}

class BedStorage extends PureComponent{
  render(){
    let {bedCollection} = this.props;
    return (
      <svg width='100' height="20" viewBox="0 0 5 1" xmlns="http://www.w3.org/2000/svg">
        {[...new Array(5).keys()].map( (i)=> {
          if (i.toString() in bedCollection) {
            return <rect key={i} x={i} y='0' width="1" height="1" fill="red" strokeWidth="0.2" stroke="white" />;
          } else {
            return <rect key={i} x={i} y='0' width="1" height="1" fill="lightgrey" strokeWidth="0.2" stroke="white" />;
          }
        })}
      </svg>
    );
  }
}

class PatientBedAssignmentStorage extends PureComponent{
  render(){
    let {patientBedAssignmentCollection} = this.props;
    return (
      <svg width="1000" height="50" viewBox="0 0 100 5" xmlns="http://www.w3.org/2000/svg">
        {[...new Array(5*100).keys()].map( (i)=>{
          let d = i%100;
          let b = Math.floor(i/100);
          return <rect key={i} x={d} y={b} width={1} height="1" fill="lightgrey" strokeWidth="0.2" stroke="white" />;
          }
        )}
        {Object.values(patientBedAssignmentCollection).map( (obj)=>
          <rect key={obj.__ID__} x={obj.START_DAY} y={obj.__REF__BED} width={obj.END_DAY-obj.START_DAY+1} height="1" fill="red" strokeWidth="0.2" stroke="white" />
        )}
      </svg>
    );
  }
}

class PersonnelBedAssignmentStorage extends PureComponent{
  render(){
    let {personnelBedAssignmentCollection} = this.props;
    return (
      <svg width="1000" height="50" viewBox="0 0 100 5" xmlns="http://www.w3.org/2000/svg">
        {[...new Array(5*100).keys()].map( (i)=>{
          let d = i%100;
          let b = Math.floor(i/100);
          return <rect key={i} x={d} y={b} width={1} height="1" fill="lightgrey" strokeWidth="0.2" stroke="white" />;
          }
        )}
        {Object.values(personnelBedAssignmentCollection).map( (obj)=>
          <rect key={obj.__ID__} x={obj.START_DAY} y={obj.__REF__BED} width={obj.END_DAY-obj.START_DAY+1} height="1" fill="red" strokeWidth="0.2" stroke="white" />
        )}
      </svg>
    );
  }
}

class Downloader extends PureComponent{
  constructor(props) {
    super(props);
    this.cache=[];
  }
  
  render(){
    return null;
  }
  
  componentDidMount(){
    this.download();
  }
  
  componentDidUpdate(prevProps){
    if (this.props.day!==prevProps.day) {
      this.download();
    }
  }
  
  async download() {
    let {day,updateDataHandler} = this.props;
    this.invalidateCache();
    let tmpData = this.getDataFromCache(this.cache);
    let ignore = {
      BED: tmpData.BED.map(obj=>obj.__ID__),
      PATIENT: tmpData.PATIENT.map(obj=>obj.__ID__),
      PERSONNEL: tmpData.PERSONNEL.map(obj=>obj.__ID__),
      PATIENT_BED_ASSIGNMENT: tmpData.PATIENT_BED_ASSIGNMENT.map(obj=>obj.__ID__),
      PERSONNEL_BED_ASSIGNMENT: tmpData.PERSONNEL_BED_ASSIGNMENT.map(obj=>obj.__ID__),
      };
    let bedFetch = fetch(
      "http://localhost:5000/api/relational-query",
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...this.createBedQuery(day),ignore})
      }
    ).then(
      res=>res.json()
    );
    let patientFetch = fetch(
      "http://localhost:5000/api/relational-query",
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...this.createPatientQuery(day),ignore})
      }
    ).then(
      res=>res.json()
    );
    let personnelFetch = fetch(
      "http://localhost:5000/api/relational-query",
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...this.createPersonnelQuery(day),ignore})
      }
    ).then(
      res=>res.json()
    );
    let [bedRes,patientRes,personnelRes] = await Promise.all( [bedFetch,patientFetch,personnelFetch] );
    let curData = {...bedRes,...patientRes,...personnelRes};
    this.addToCache(curData);
    let data = this.getDataFromCache(this.cache);
    let indexedData = this.indexData(data);
    updateDataHandler(indexedData);
  }
  
  indexData(data) {
    let indexedData = {};
    for (let [entity,collection] of Object.entries(data)) {
      indexedData[entity] = {};
      for (let obj of collection) {
        indexedData[entity][obj["__ID__"]] = obj;
      }
    }
    return indexedData;
  }
  
  invalidateCache(){
    if (this.cache.length >= 10) {
      this.cache = this.cache.slice(-9);
    }
  }
  
  addToCache(data){
    let isEmpty = true;
    for (let entity of ["BED","PATIENT","PERSONNEL","PATIENT_BED_ASSIGNMENT","PERSONNEL_BED_ASSIGNMENT"]) {
      if (data[entity].length > 0) {
        isEmpty = false;
        break;
      }
    }
    if (!isEmpty) {
      this.cache = [...this.cache,data];
    }
  }
  
  getDataFromCache(cache){
    let ret = {BED:[],PATIENT:[],PERSONNEL:[],PATIENT_BED_ASSIGNMENT:[],PERSONNEL_BED_ASSIGNMENT:[]};
    for (let data of cache) {
      for (let [entity,collection] of Object.entries(data)) {
        ret[entity].push(...collection);
      }
    }
    return ret;
  }
  
  createBedQuery(day){
    return (
      {
        "select": {
          "BED":{
            "NAME":null
          }
        }
      }
    );
  }
  
  createPatientQuery(day){
    return (
      {
        "select": {
          "PATIENT":{
            "NAME":null
          },
          "PATIENT_BED_ASSIGNMENT":{
            "START_DAY":null,
            "END_DAY":null,
            "__REF__BED":null
          }
        },
        "filter":{
          "op":"BETWEEN",
          "variables":[
            day,
            {"entity":"PATIENT_BED_ASSIGNMENT","attribute":"START_DAY"},
            {"entity":"PATIENT_BED_ASSIGNMENT","attribute":"END_DAY"}
          ]
        }
      }
    );
  }
  
  createPersonnelQuery(day){
    return (
      {
        "select": {
          "PERSONNEL":{
            "NAME":null
          },
          "PERSONNEL_BED_ASSIGNMENT":{
            "START_DAY":null,
            "END_DAY":null,
            "__REF__BED":null
          }
        },
        "filter":{
          "op":"BETWEEN",
          "variables":[
            day,
            {"entity":"PERSONNEL_BED_ASSIGNMENT","attribute":"START_DAY"},
            {"entity":"PERSONNEL_BED_ASSIGNMENT","attribute":"END_DAY"}
          ]
        }
      }
    );
  }
}

export default App;
