import { Router, BodyType, BodyJson } from "https://deno.land/x/oak/mod.ts";
import * as planets from "./models/planets.ts";
import * as launches from "./models/launches.ts";
import { Launch } from "./models/launches.ts";

const router = new Router();

router.get("/", ctx => {
    ctx.response.body = `
    {___     {__      {_         {__ __        {_       
    {_ {__   {__     {_ __     {__    {__     {_ __     
    {__ {__  {__    {_  {__     {__          {_  {__    
    {__  {__ {__   {__   {__      {__       {__   {__   
    {__   {_ {__  {______ {__        {__   {______ {__  
    {__    {_ __ {__       {__ {__    {__ {__       {__ 
    {__      {__{__         {__  {__ __  {__         {__
                    Mission Control API`; 
 });

router.get("/planets", ctx => {
    ctx.response.body = planets.getAllPlanets();
});

router.get("/launches", ctx => {
    ctx.response.body = launches.getAll();
});

router.get("/launches/:id", ctx => {
    if(ctx.params?.id){
         const launchesList = launches.getOne(Number(ctx.params.id));
         if(launchesList){
            ctx.response.body = launchesList;
         } else{
             ctx.throw(400, "Launch with that id does not exists")
         }
    }
});

router.post("/launches", async ctx => {
    const body = await ctx.request.body();  
    const data: unknown  =  await body.value;
    launches.addOne(data as Launch);
    
    ctx.response.body = { success: true };
    ctx.response.status = 201;

  });
  
 export default router;