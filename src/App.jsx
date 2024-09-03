import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import DashboardMembers from "./components/DashboardMembers";
import DashboardLeader from "./components/DashboardLeader";
import ViewTask from "./components/ViewTask";
import ViewAnnounments from "./components/ViewAnnounments";
import "./App.css";
import Issues from "./components/Issues";
import Request from "./components/Request";
import Approval from "./components/Approval";
import JoinEvents from "./components/JoinEvents";
import { auth } from "./config/firebase";
import DashboardPresident from "./components/DashboardPresident";
import DashboardMentor from "./components/DashboardMentor";
import ResolveIssue from "./components/ResolveIssue";
import Image from "./components/Image";
import { useState } from "react";
import AboutPage from "./components/AboutPage";
import OngoingTask from "./components/OngoingTask";
import Appoint from "./components/Appoint";
import SendEmail from "./components/SendEmail";
import AppointLeader from "./components/AppointLeader";
import AppointPresident from "./components/AppointPresident";
import Team from "./components/Team";
import Executive from "./components/Executive";
import EventRegistrations from "./components/EventRegistrations";


function App() {

  const [role,setRole]=useState("");
  const [team,setTeam]=useState("");

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<SignUp auth={auth}/>} />
          <Route path="/login" element={<LogIn auth={auth}  setRole={setRole} setTeam={setTeam}/>} />
          <Route path="/dashboard-member" element={<DashboardMembers auth={auth}/>} />
          <Route path="/dashboard-leader" element={<DashboardLeader auth={auth}/>} />
          <Route path="/dashboard-president" element={<DashboardPresident auth={auth}/>} />
          <Route path="/dashboard-mentor" element={<DashboardMentor auth={auth}/>} />
          <Route path="/view-task" element={<ViewTask team={team} />} /> 
          {/* <Route path="/view-event" element={<ViewAnnounments />} /> */}
          <Route path="/add-issues" element={<Issues />} />
          <Route path="/request-event" element={<Request />} />
          <Route path="/approve-event" element={<Approval/>} />
          <Route path="/join-event" element={<JoinEvents/>} />
          <Route path="/resolve-issue" element={<ResolveIssue/>} />
          <Route path="/send-invitation" element={<SendEmail/>} />
          <Route path="/ongoing-task" element={<OngoingTask team={team} />} />
          <Route path="/appoint-members" element={<Appoint team={team}/>} />
          <Route path="/appoint-leader" element={<AppointLeader/>} />
          <Route path="/appoint-president" element={<AppointPresident/>} />
          <Route path="/upload-image" element={<Image role={role}/>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/teams" element={<Team />} />
          <Route path="/executive" element={<Executive/>} />
          <Route path="/registrations" element={<EventRegistrations/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
