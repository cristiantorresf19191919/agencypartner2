/**
 * One-time extend() call for @pixi/react v8.
 * Import this file once before using any declarative PixiJS components.
 */
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";

extend({ Container, Graphics, Text });
