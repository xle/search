import { Octokit } from 'octokit';

export class Parser {
  private octokit: Octokit;
  constructor(readonly githubKey: string) {
    this.octokit = new Octokit({ auth: this.githubKey });
  }

  async parseTree(branchName: string) {
    const result: Record<string, Record<string, number>> = {};
    if (!branchName) {
      throw new Error('branch name is mandatory');
    }

    //recursive 1 => limitation of 7mb and 100.000 item
    //tested with all the branch of the lodash its ok
    //but if we want this to be a library repo agnostic then recursion should be manage
    //by code
    try {
      const response = await this.octokit.request(
        `GET /repos/lodash/lodash/git/trees/${branchName}?recursive=1`
      );

      let counterRequest = 0;
      for (const item of response.data.tree) {
        const extension = item.path.substring(item.path.lastIndexOf('.'));
        if (item.type === 'blob' && (extension === '.js' || extension === '.ts')) {
          try {
            console.log(`process file ${item.path}`);
            const start = Date.now();
            const fileContent = await this.octokit.request(`GET ${item.url}`, {
              mediaType: {
                format: 'raw',
              },
            });
            const end = Date.now();
            console.log(`call took ${(end - start) / 1000} s`);
            counterRequest = counterRequest + (end - start);
            result[item.path] = this.counter(fileContent.data);
          } catch (err) {
            console.log(`error occurs during processing od ${item.path} skip it`);
            console.log(err.message);
          }
        }
      }
      console.log(`Total get request ${counterRequest / 1000} s`);
      return result;
    } catch (error) {
      console.log(`error occurs not possible to parse anything ${error.message}`);
      throw error;
    }
  }

  private counter(str: string) {
    const result: Record<string, number> = {};
    for (const ch of str) {
      const char = ch.trim().toLowerCase();
      //by spec on how often each letter is present
      //i consider a letter as a=>z
      if (char.charCodeAt(0) >= 97 && char.charCodeAt(0) <= 122) {
        result[char] = (result[char] || 0) + 1;
      }
    }
    return this.sort(result, true);
  }

  //Array.sort use quick sort on array of number
  private sort(dict: Record<string, number>, desc: boolean) {
    return Object.fromEntries(
      Object.entries(dict).sort((a, b) => (desc ? b[1] - a[1] : a[1] - b[1]))
    );
  }

  /*private mergeSort(arr: [string, number][]) {
    if (arr.length <= 1) return arr;

    const middle = Math.floor(arr.length / 2);

    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return this.merge(this.mergeSort(left), this.mergeSort(right));
  }*/

  /*private merge(left: [string, number][], right: [string, number][]) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex][1] > right[rightIndex][1]) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    return result.concat(left.slice(leftIndex), right.slice(rightIndex));
  }*/
}
