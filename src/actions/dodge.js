export const dodge = async (data, radius, sortBy, xScale, height) => {
  const radius2 = (await radius) ** 2;
  const circles = await data;
  const placer = data => {
    return data[sortBy];
  };
  const swarmCircles = circles
    .map(d => ({ x: xScale(placer(d)), data: d }))
    .sort((a, b) => a.x - b.x);
  const epsilon = 1e-3;
  let head = null,
    tail = null;

  // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
  function intersects(x, y) {
    let a = head;
    while (a) {
      if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
        return true;
      }
      a = a.next;
    }
    return false;
  }

  // Place each circle sequentially.
  for (const b of swarmCircles) {
    // Remove circles from the queue that can’t intersect the new circle b.
    while (head && head.x < b.x - radius2) head = head.next;

    // Choose the minimum non-intersecting tangent.
    if (intersects(b.x, (b.y = radius))) {
      let a = head;
      b.y = height;
      do {
        let y = a.y + Math.sqrt(radius2 - (a.x - b.x) ** 2);
        if (y < b.y && !intersects(b.x, y)) b.y = y;
        a = a.next;
      } while (a);
    }

    // Add b to the queue.
    b.next = null;
    if (head === null) head = tail = b;
    else tail = tail.next = b;
  }

  return swarmCircles;
};
