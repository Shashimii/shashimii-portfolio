<?php

use Inertia\Testing\AssertableInertia as Assert;

test('renders the home portfolio page', function () {
    $response = $this->get(route('home'));

    $response->assertInertia(fn (Assert $page) => $page->component('welcome'));
});
