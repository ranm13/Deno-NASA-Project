import {log, flatMap } from "../deps.ts";

export interface Launch{
    flightNumber: number;
    mission: string;
    rocket: string;
    customers: Array<string>;
    launchDate: number;
    upcoming: boolean;
    success?: boolean;
    target?: string;
}
const launches = new Map<number, Launch>();

async function downloadLaunchData(){
    log.info("Downloading launch data...");

    const response = await fetch("https://api.spacexdata.com/v3/launches");
    
    if(!response.ok){
        log.warning("Problem downloading launch data.");
        throw new Error("Launch data download failed");
        
    }

    const launchData = await response.json();
    for(const launch of launchData){
        const payloads = launch["rocket"]["second_stage"]["payloads"]
        const customers = flatMap(payloads, (payload:any) => payload["customers"]);
        const flightData = {
            flightNumber: launch["flight_number"],
            mission: launch["mission_name"],
            rocket: launch["rocket"]["rocket_name"],
            launchDate:  launch["launch_date_unix"],
            upcoming: launch["upcoming"],
            success: launch["launch_success"],
            customers: customers
        }

        launches.set(flightData.flightNumber, flightData);
        log.info(JSON.stringify(flightData));
    }

}

if(!import.meta.main){
    await downloadLaunchData();
    log.info(JSON.stringify(import.meta));
    log.info(`Downloading data for ${launches.size} SpaceX launches`);
}

export function getAll(){
    return Array.from(launches.values());
}

export function getOne(id: number){
    if(launches.has(id)){
        return launches.get(id);
    }
    return null;
}

export function removeOne(id: number){
    if(launches.has(id)){
        const abortedLaunch = launches.get(id);
        if(abortedLaunch){
            abortedLaunch.upcoming = false;
            abortedLaunch.success = false;
        }
        return abortedLaunch;
    }
    return null;
}


export function addOne(data: Launch) {
    let nextLaunch: Launch =  Object.assign(data, {
        upcoming: true,
        customers: ["Zero to Mastery", "NASA"],
      });
    launches.set(
      data.flightNumber,
      nextLaunch
    );
  }