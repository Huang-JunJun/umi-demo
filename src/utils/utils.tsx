export const generateRandomId = () => {
  return (
    'id-' +
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).substring(2, 15)
  );
};

export const findMax = (data: any, type: any) => {
  return data.reduce(
    (max: any, item: any) => (item[type] > max[type] ? item : max),
    data[0],
  );
};

export const findMin = (data: any, type: any) => {
  return data.reduce(
    (min: any, item: any) => (item[type] < min[type] ? item : min),
    data[0],
  );
};

// requests 请求数组 num 一次请求的个数
export const loopRequest = async (requests: any[]) => {
  const length = requests.length;
  let flag = true;
  let errorRequest = null;

  for (let i = 0; i < length; i++) {
    const res = await requests[i];
    if (res.success) {
      continue;
    } else {
      flag = false;
      errorRequest = res;
      break;
    }
  }

  return { success: flag, errorRequest: errorRequest };
};

// 接受一个参数reqs，它是一个数组，包含需要发送的请求。函数的主要目的是对这些请求进行队列管理，确保并发请求的数量不会超过设定的上限。
export const handQueue = (
  reqs: any, // 请求数量
) => {
  reqs = reqs || [];

  const requestQueue = (concurrency: number) => {
    concurrency = concurrency || 6; // 最大并发数
    const queue: any[] = []; // 请求池
    let current = 0;

    const dequeue = () => {
      while (current < concurrency && queue.length) {
        current++;
        const requestPromiseFactory = queue.shift(); // 出列
        requestPromiseFactory()
          .then(() => {
            // 成功的请求逻辑
            console.log('全请求成功了');
          })
          .catch((error: any) => {
            // 失败
            console.log(error);
          })
          .finally(() => {
            current--;
            dequeue();
          });
      }
    };

    return (requestPromiseFactory: any) => {
      queue.push(requestPromiseFactory); // 入队
      dequeue();
    };
  };

  const enqueue = requestQueue(6);

  for (let i = 0; i < reqs.length; i++) {
    enqueue(reqs[i]);
  }
};
