function sum(a, b) {
    console.log('worked');
    return a + b;
}

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toEqual(3);
});
