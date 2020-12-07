// https://adventofcode.com/2020/day/7

const { getInput } = require('../../utils');

const input = getInput(__dirname);

const TARGET_BAG = 'shiny gold';

const bags = input
    .split('\n')
    .map(row => row.split(' bags contain '))
    .reduce((acc, [color, contents]) => {
        acc[color] = {
            color,
            children:
                contents === 'no other bags.'
                    ? {}
                    : contents
                          .split(',')
                          .map(bag => bag.match(/(\d+) (\w+ \w+)/))
                          .reduce((acc, [, count, bag]) => {
                              acc[bag] = Number(count);

                              return acc;
                          }, {}),
        };

        return acc;
    }, {});

exports.partOne = () => {
    const visited = new Set();

    const canReachTargetBag = ({ color, children }) => {
        if (color === TARGET_BAG || visited.has(color)) {
            return true;
        }

        for (const child in children) {
            const reached = canReachTargetBag(bags[child]);

            if (reached) {
                visited.add(color);

                return true;
            }
        }

        return false;
    };

    let count = 0;

    for (const bag in bags) {
        if (bag !== TARGET_BAG && canReachTargetBag(bags[bag])) {
            count++;
        }
    }

    return count;
};

exports.partTwo = () => {
    const countBagContents = node => {
        let total = 1;

        for (const child in node.children) {
            const totalChildCounts = countBagContents(bags[child]);
            total += totalChildCounts * node.children[child];
        }

        return total;
    };

    return countBagContents(bags[TARGET_BAG]) - 1;
};
