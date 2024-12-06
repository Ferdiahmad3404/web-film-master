<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;
use Tymon\JWTAuth\Http\Middleware\Authenticate as JWTAuthenticate;
use Tymon\JWTAuth\Http\Middleware\RefreshToken as JWTRefresh;

class Kernel extends HttpKernel
{
    protected $middlewareGroups = [
        'web' => [
            'throttle:api',
            'bindings',
        ],

        'api' => [
            \Illuminate\Http\Middleware\HandleCors::class,
            'throttle:api',
            'bindings',
        ],
    ];

    protected $routeMiddleware = [
        'jwt.auth' => JWTAuthenticate::class,
        'jwt.refresh' => JWTRefresh::class,
    ];
}
