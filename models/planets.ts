import { join } from "https://deno.land/std/path/mod.ts";
import { BufReader } from "https://deno.land/std/io/mod.ts";
import { parse } from "https://deno.land/std/encoding/csv.ts";
import * as _ from "https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/lodash.js";

interface Planet {
    [ key: string ] : string
}

let planets: Array<Planet>;

export function filterHabitablePlanets(planets:Array<Planet>):Array<Planet>{
    return planets.filter(planet => {
        const planetaryRadius = Number(planet["koi_prad"]);
        const stellarMass =  Number(planet["koi_smass"]);
        const stellarRadius =  Number(planet["koi_srad"]);

        return planet["koi_disposition"] === "CONFIRMED"
        && planetaryRadius > 0.5 && planetaryRadius < 1.5
        && stellarMass > 0.78 && stellarMass < 1.04 
        && stellarRadius > 0.99 && stellarRadius < 1.01;
    });
}

async function loadPlanetsData():Promise<Array<Planet>>{
    const path:string = join("data", "kepler_exoplanets_nasa.csv")
    const file:Deno.File = await Deno.open(path);
    const bufReader = new BufReader(file);
    const result = await parse(bufReader, {
        header: true,
        comment: "#"
    }) as Array<Planet>;

    Deno.close(file.rid);

    const planets:Array<Planet> = filterHabitablePlanets(result);

    return planets.map(planet => {
        return (_.pick(planet, [
            "koi_prad", 
            "koi_smass", 
            "koi_srad",
            "kepler_name",
            "koi_count",
            "koi_steff"
        ]))
    });

}

planets = await loadPlanetsData();
log.info(`${planets.length} habitable planets found!`);

export function getAllPlanets():Array<Planet>{
    return planets;
}
