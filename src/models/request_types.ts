import { Request } from "express";
import {userViewType} from "./userViewModel";
export type RequestWithBody<B> = Request<{}, {}, B>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithURL<U> = Request<U>;
export type RequestWithUrlAndBody<U, B> = Request<U, {}, B>;
export type RequestWithUrlAndQuery<U, Q> = Request<U, {}, {}, Q>;
export type RequestWithUser<U extends userViewType> = Request<{}, {}, {}, {}, U >;
export type RequestWithDeviceId<D extends {deviceId: string}> = Request<{}, {}, {}, {}, D >;
export type RequestWithUserAndDeviceId<D extends {deviceId: string}, userViewType> = Request<{}, {}, {}, {}, D >